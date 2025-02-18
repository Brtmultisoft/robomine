
'use strict';
const logger = require('../../services/logger');
const log = new logger('IncomeController').getChildLogger();
const { incomeDbHandler, userDbHandler, investmentDbHandler, settingDbHandler } = require('../../services/db');
const { getTopLevelByRefer } = require('../../services/commonFun');
const mongoose = require('mongoose');
const cron = require('node-cron');
const config = require('../../config/config');
const { investmentModel } = require('../../models');

const ObjectId = mongoose.Types.ObjectId;

const distributeTokens = async () => {
    try {
        const today = new Date();
        const elapsedYears = config.startDate instanceof Date ? Math.floor((today - config.startDate) / (1000 * 60 * 60 * 24 * 365)) + 1 : 0;


        if (elapsedYears > 4) return log.info("Token distribution period ended");

        const dailyTokens = config.tokenDistributionByYear[elapsedYears];
        console.log(dailyTokens);
        
        // Total Staking Calculation
        const totalInvestments = await investmentModel.aggregate([
            { $match: { status: 1, type :1 } },
            { $group: { _id: null, totalStaked: { $sum: "$amount" } } }
        ]);
        if (!totalInvestments.length) return log.info("No active investments found");

        const totalStaked = totalInvestments[0].totalStaked;
        console.log(totalStaked);
        

        // 50% Public Staking & 50% Admin Wallets
        const publicShare = dailyTokens * 0.50;
        const adminShare = dailyTokens * 0.50;

        // Distribute Admin Share (Each admin gets 25% of adminShare)
        const adminAmount = adminShare / config.adminWallets.length;
        for (const admin of config.adminWallets) {
            await userDbHandler.updateOneByQuery(
                { _id: ObjectId(admin) },
                { $inc: { wallet: adminAmount } }
            );
            await incomeDbHandler.create({
                user_id: admin,
                amount: adminAmount,
                type: 3,
                remarks: "Admin wallet distribution"
            });
        }

        // Distribute Public Staking
        const investments = await investmentModel.find({ status: 1, type:1 });
        for (const investment of investments) {
            const userShare = (investment.amount / totalStaked) * publicShare * 0.50;
            console.log("investment amount", investment.amount);
            
            console.log(userShare);
            
            const levelIncomeShare = userShare * 0.50; // 50% for Level ROI
            const rewardAchieverShare = userShare * 0.50; // 50% for Reward & Achiever
            console.log(levelIncomeShare);
            console.log(rewardAchieverShare);
            await userDbHandler.updateOneByQuery(
                { _id: ObjectId(investment.user_id) },
                { $inc: { reward: userShare, "extra.dailyIncome": userShare } }
            );

            await incomeDbHandler.create({
                user_id: investment.user_id,
                investment_id: investment._id,
                amount: userShare,
                type: 1,
                remarks: "Daily token distribution"
            });

            // Distribute Level Income
            await distributeLevelIncome(investment.user_id, levelIncomeShare);

            // Transfer to Reward & Achiever Wallet
            await transferToRewardWallet(rewardAchieverShare);
        }

        log.info("Daily token distribution completed successfully.");
    } catch (error) {
        log.error("Error in token distribution", error);
    }
};

// Distribute Level Income
const distributeLevelIncome = async (user_id, amount) => {
    try {
        let topLevels = await getTopLevelByRefer(user_id, config.levelIncomePercentages.length);
        for (let i = 0; i < topLevels.length; i++) {
            let levelUser = topLevels[i];
            if (!levelUser) continue;   

            let levelAmount = (amount * config.levelIncomePercentages[i]) / 100;
            await userDbHandler.updateOneByQuery(
                { _id: ObjectId(levelUser) },
                { $inc: { reward: levelAmount, "extra.levelIncome": levelAmount, "extra.totalIncome": levelAmount } }
            );

            await incomeDbHandler.create({
                user_id: levelUser,
                user_id_from: user_id,
                amount: levelAmount,
                level: i + 1,
                type: 5,
                remarks: `Level ${i + 1} income ${amount * config.levelIncomePercentages[i]}%`,
                extra: {
                    income_type: "level"
                }
            });
        }
    } catch (error) {
        log.error("Error in level income distribution", error);
    }
};

// Transfer Remaining to Reward & Achiever Wallet
const transferToRewardWallet = async (amount) => {
    try {
        await userDbHandler.updateOneByQuery(
            { _id: ObjectId(config.rewardWallet) },
            { $inc: { wallet: amount } }
        );

        await incomeDbHandler.create({
            user_id: config.rewardWallet,
            amount: amount,
            type: 4,
            remarks: "Reward & Achiever Wallet Distribution"
        });
    } catch (error) {
        log.error("Error transferring to Reward & Achiever Wallet", error);
    }
};

// Schedule Cron Job to Run Daily at Midnight
cron.schedule('0 0 * * *', distributeTokens, {
    scheduled: true,
    timezone: "UTC"
});

const distributeTokensHandler = async (req, res) => {
    try {
        await distributeTokens();  // Call the function that handles the distribution
        res.status(200).json({ message: "Token distribution triggered successfully" });
    } catch (error) {
        log.error("Error triggering token distribution", error);
        res.status(500).json({ message: "Error triggering token distribution" });
    }
};

module.exports = { distributeTokensHandler, distributeLevelIncome };

