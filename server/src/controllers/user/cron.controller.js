'use strict';
const logger = require('../../services/logger');
const log = new logger('IncomeController').getChildLogger();
const { incomeDbHandler, userDbHandler, investmentDbHandler, settingDbHandler } = require('../../services/db');
const { getTopLevelByRefer, getPlacementIdByRefer, getPlacementId } = require('../../services/commonFun');
const mongoose = require('mongoose');
const cron = require('node-cron');
const config = require('../../config/config');
const { investmentModel } = require('../../models');

const ObjectId = mongoose.Types.ObjectId;

const distributeTokens = async () => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999))
        // Fetch all new users created today
        const newUsers = await userDbHandler.getByQuery({
            created_at: { $gte: startOfDay, $lt: endOfDay },
            status: 1
        });
     
        for (const newUser of newUsers) {
            // Fetch previous users created before the new user
            const previousUsers = await userDbHandler.getByQuery({
                created_at: { $lt: newUser.created_at },
                status: 1
            }); 
            console.log("previousUsers",previousUsers.length);
            if (previousUsers.length === 0) continue; // Skip if no previous users

            // Calculate total investment made by the new user today
            const investmentsToday = await investmentDbHandler.getByQuery({
                user_id: newUser._id,
                createdAt: { $gte: startOfDay, $lt: endOfDay },
                status: 1,
                type : 0
            });
           
            const totalInvestment = investmentsToday.reduce((sum, investment) => sum + investment.amount, 0);
           
            if (totalInvestment === 0) continue; // Skip if no investment

            const provisionAmount = totalInvestment * 0.4; // 40% of today's investment
            const amountPerUser = provisionAmount / previousUsers.length; // Distribute equally among previous users
        
            // Distribute to previous users
            for (let prevUser of previousUsers) {
                await userDbHandler.updateOneByQuery(
                    { _id: ObjectId(prevUser._id) },
                    {
                        $inc: {
                            wallet: amountPerUser,
                            "extra.provisionIncome": amountPerUser
                        }
                    }
                );
                await incomeDbHandler.create({
                    user_id: ObjectId(prevUser._id),
                    type: 2,
                    amount: amountPerUser,
                    status: 1,
                    extra: {
                        income_type: "provision"
                    }
                });
            }
        }

        log.info("Provision distribution completed successfully.");
    } catch (error) {
        log.error("Error in provision distribution", error);
    }
}

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

const distributeGlobalAutoPoolMatrixIncome = async (user_id, amount) => {
    try {
        // Fetch the new user
        const newUser = await userDbHandler.getById(user_id);
        if (!newUser) throw new Error("User not found");

        // Use the placement_id stored in the newUser object
        let currentPlacementId = newUser.placement_id;
        if (!currentPlacementId) throw new Error("No placement available");

        // Calculate matrix income (10% of the amount)
        const matrixIncome = (amount * 10) / 100;

        // Traverse the placement hierarchy until placement_id becomes null
        while (currentPlacementId) {
            const placementUser = await userDbHandler.getOneByQuery({ _id: ObjectId(currentPlacementId) });
            if (!placementUser) break;

            // Distribute matrix income to the placement user
            await userDbHandler.updateOneByQuery({ _id: ObjectId(currentPlacementId) }, {
                $inc: {
                    wallet: matrixIncome,
                    "extra.matrixIncome": matrixIncome
                }
            });

            await incomeDbHandler.create({
                user_id: ObjectId(currentPlacementId),
                user_id_from: ObjectId(user_id),
                amount: matrixIncome,
                type: 6,
                status: 1,
                extra: {
                    income_type: "matrix",
                }
            });

            // Move to the next placement user
            currentPlacementId = placementUser.placement_id;
        }

        return true;

    } catch (error) {
        log.error("Error in matrix income distribution:", error);
        throw error;
    }
};


module.exports = { distributeTokensHandler, distributeLevelIncome, distributeGlobalAutoPoolMatrixIncome };

