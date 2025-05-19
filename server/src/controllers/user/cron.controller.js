// 'use strict';
// const logger = require('../../services/logger');
// const log = new logger('IncomeController').getChildLogger();
// const { incomeDbHandler, userDbHandler, investmentDbHandler, investmentPlanDbHandler, settingDbHandler, withdrawalDbHandler } = require('../../services/db');
// const { getChildLevelsByRefer, getTopLevelByRefer, getChildLevels, getSingleDimensional } = require('../../services/commonFun');
// const responseHelper = require('../../utils/customResponse');
// const config = require('../../config/config');
// const { userModel, withdrawalModel } = require('../../models');
//const axios = require('axios')

// const ethers = require('ethers');

// const mongoose = require('mongoose')
// const ObjectId = mongoose.Types.ObjectId

// const levelIncome = async (user_id_to, level_amount, mainAmt) => {
//     try {
//         let top = await getTopLevelByRefer(user_id_to, level_amount.length).catch(e => { throw e })
//         let i = 0;
//         let level = top.length;
//         if (level > 0) {
//             while (i < level) {
//                 let value = top[i];
//                 if (value === null || value === 'null') throw "No Upline Exists!!!"
//                 let j = i;
//                 if (i < top.length) { j = i; } else { j = top.length; }
//                 let percentage = level_amount[j];
//                 let new_amount = mainAmt * (percentage / 100);
//                 // let _user = await userDbHandler.getById(value);
//                 // if (_user.topup > 0) {
//                 // let levelData = {
//                 //     user_id: value,
//                 //     user_id_from: user_id_to,
//                 //     amount: new_amount,
//                 //     wamt: new_amount,
//                 //     iamount: amount,
//                 //     level: i,
//                 //     type: 1
//                 // }
//                 // await userDbHandler.updateById(value, { $inc: { wallet: new_amount } });
//                 // await incomeDbHandler.create(levelData);
//                 // }
//                 let _user = await userDbHandler.getById(value);
//                 if (_user?.extra.totalIncome > 0) {
//                     let levelData = {
//                         user_id: value,
//                         user_id_from: user_id_to,
//                         amount: new_amount,
//                         wamt: new_amount,
//                         iamount: new_amount,
//                         level: i,
//                         type: 1
//                     }
//                     await userDbHandler.updateOneByQuery({ _id: value }, { $inc: { wallet: new_amount, "extra.levelIncome": new_amount, "extra.totalIncome": new_amount } });
//                     await incomeDbHandler.create(levelData);
//                 }
//                 i++;
//             }
//         }
//     } catch (error) {
//         log.error(`error in level income: `, error)
//     }
// }

// module.exports = {

//     levelIncome,

//     resetAssignTokens: async (req, res) => {
//         log.info('Recieved request for resetAssignTokens:');
//         let responseData = {};
//         try {
//             resetAssignTokens()
//             responseData.msg = 'Reset Assign Token Cron ran Successfully!';
//             responseData.data = null;
//             return responseHelper.success(res, responseData);
//         } catch (error) {
//             responseData.msg = error;
//             responseData.data = null;
//             return responseHelper.error(res, responseData);
//         }
//     },

//     assignTokens: async (req, res) => {
//         log.info('Recieved request for assignTokens:');
//         let responseData = {};
//         try {
//             assignTokens()
//             responseData.msg = 'Assign Token Cron ran Successfully!';
//             responseData.data = null;
//             return responseHelper.success(res, responseData);
//         } catch (error) {
//             responseData.msg = error;
//             responseData.data = null;
//             return responseHelper.error(res, responseData);
//         }
//     },

//     withdrawCron: async (req, res) => {
//         log.info('Recieved request for withdrawCron:');
//         let responseData = {};
//         try {
//             withdraw_cron()
//             responseData.msg = 'Withdraw Cron ran Successfully!';
//             responseData.data = null;
//             return responseHelper.success(res, responseData);
//         } catch (error) {
//             responseData.msg = error;
//             responseData.data = null;
//             return responseHelper.error(res, responseData);
//         }
//     },

//     restartProj: async (req, res) => {
//         log.info('Recieved request for restartProj:');
//         let responseData = {};
//         try {
//             const { exec } = require('child_process');
//             exec('~/ultra/make.sh',
//                 (error, stdout, stderr) => {
//                     console.log(stdout);
//                     console.log(stderr);
//                     if (error !== null) {
//                         console.log(`exec error: ${error}`);
//                     }
//                 });
//             responseData.msg = 'Project Restart Successfully!';
//             responseData.data = null;
//             return responseHelper.success(res, responseData);
//         } catch (error) {
//             responseData.msg = error;
//             responseData.data = null;
//             return responseHelper.error(res, responseData);
//         }
//     },

//     roi: async (req, res) => {
//         log.info('Recieved request for getCron:');
//         let responseData = {};
//         try {

//             let today = new Date().getDay()
//             if (today !== 6 && today !== 0)
//                 updateROI()

//             responseData.msg = 'ROI cron run successfully!';
//             responseData.data = null;
//             return responseHelper.success(res, responseData);
//         } catch (error) {
//             log.error('failed to run roi cron with error::', error);
//             responseData.msg = 'Failed to run roi cron';
//             return responseHelper.error(res, responseData);
//         }
//     },

//     royalty: async (req, res) => {
//         log.info('Recieved request for getRoyaltyCron:');
//         let responseData = {};
//         try {

//             responseData.msg = 'Royalty cron run successfully!';
//             responseData.data = null;
//             return responseHelper.success(res, responseData);
//         } catch (error) {
//             log.error('failed to run royalty cron with error::', error);
//             responseData.msg = 'Failed to run royalty cron';
//             return responseHelper.error(res, responseData);
//         }
//     },

//     updateTeamInvestment: async (req, res) => {
//         log.info('Recieved request for updating tia:');
//         let responseData = {}

//         updateTIA()

//         responseData.msg = 'CRON STARTED';
//         responseData.data = null;
//         return responseHelper.success(res, responseData);
//     },

//     updateMatchingBonus: async (req, res) => {
//         log.info('Recieved request for updating matching bonus:');
//         let responseData = {}

//         updateMBonus()

//         responseData.msg = 'CRON STARTED';
//         return responseHelper.success(res, responseData);
//     },

//     updateVIPBonus: async (req, res) => {
//         log.info('Recieved request for updating vip bonus:');
//         let responseData = {}

//         if (process.env.APP_LIVE === '0' || (new Date()).getDate() === 1)
//             updateVBonus()

//         responseData.msg = 'CRON STARTED';
//         return responseHelper.success(res, responseData);
//     }
// }

// const assignTokens = async () => {

//     try {

//         const { value: tokens, extra } = await settingDbHandler.getOneByQuery({ name: "tokenDistribution" });
//         const levels = extra?.levels

//         const users = await userDbHandler.getByQuery(
//             {
//                 $or: [{ "extra.assigned": { $ne: true } }, { "extra.assigned": { $exists: false } }],
//                 $and: [
//                     { "extra.facebook": true },
//                     { "extra.linkedin": true },
//                     { "extra.x": true },
//                     { "extra.instagram": true },
//                     { "extra.youtube": true }
//                 ]
//             }
//         )

//         for (const el of users) {
//             try {

//                 await userDbHandler.updateOneByQuery(
//                     { _id: el._id },
//                     {
//                         $set: {
//                             "extra.assigned": true,
//                         },
//                         $inc: {
//                             wallet: tokens
//                         }
//                     }
//                 )

//                 await incomeDbHandler.create({
//                     user_id: el._id,
//                     amount: tokens,
//                     type: 0,
//                     wamt: tokens,
//                     iamount: tokens,
//                     date: Number(Date.now()),
//                 });

//                 await levelIncome(el._id, levels, tokens);

//             } catch (e) {
//                 continue;
//             }
//         }

//     } catch (e) {
//         console.log(e);
//     }


// }

// const resetAssignTokens = async () => {

//     try {
//         // const now = new Date();
//         // const currentHour = now.getHours();

//         // if (currentHour !== 0) throw "It's not midnight."

//         const usersCount = await userModel.count()

//         const iterateTimes = usersCount / 1000

//         for (let i = 0; i < iterateTimes; i++)

//             await userModel.updateMany(

//                 {},
//                 {
//                     $set: {
//                         "extra.assigned": false,
//                         "extra.facebook": false,
//                         "extra.linkedin": false,
//                         "extra.linkedinUrl": '',
//                         "extra.xUrl": '',
//                         "extra.instagramUrl": '',
//                         "extra.facebookUrl": '',
//                         "extra.x": false,
//                         "extra.status": false,
//                         "extra.instagram": false,
//                         "extra.first_youtube": false,
//                         "extra.second_youtube": false,
//                         "extra.third_youtube": false,
//                         "extra.share_first_youtube": false,
//                         "extra.share_second_youtube": false,
//                         "extra.share_third_youtube": false
//                     }
//                 }

//             )

//     } catch (e) {
//         log.error(`Error while reseting Assign Tokens:s`, e)
//     }

// }


// // 0 - Pending, 1 - Processed, 2 - Approved
// const withdraw_cron = async () => {

//     try {

//         const txns = await withdrawalModel.find({ status: 0 }).limit(5)
//         if (txns.length === 0) return

//         log.info(`Transactions: ${txns}`)

//         for (let i = 0; i <= txns.length; i++) {

//             // send request to the withdraw API
//             // const response = await axios.post(config.withdrawalApiUrl, { key: config.appApiKey, ...txns[i] })
//             await withdrawNow(txns[i]).then(async (hash) => {
//                 txns[i].status = 1
//                 txns[i].remark = 'Success'
//                 txns[i].txid = hash
//                 await txns[i].save()
//             })

//         }

//     } catch (error) {
//         log.error(`Error while updating Matching Income: ${error}`)
//     }

// }

// const withdrawNow = async (txn) => {
//     try {

//         let hash = null
//         const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org:443');
//         const wallet = new ethers.Wallet(config.privKey, provider);

//         // Create contract instance
//         const contractInstance = new ethers.Contract(config.withdrawAddress, config.withdrawABI, wallet);
//         const amount = (txn.amount * (10 ** 18)).toString()

//         // Calculate gas fee
//         let gasLimit = await contractInstance.estimateGas["transfer"](txn.address, amount)
//         let gasPrice = await provider.getGasPrice()
//         gasLimit = gasLimit.mul(110).div(100)
//         gasPrice = gasPrice.mul(2)

//         // Check wallet balance for gas fee
//         const balance = await wallet.getBalance();
//         if (balance.lt(gasPrice)) {
//             return res.status(400).json({ error: 'Insufficient balance for gas fee' });
//         }

//         try {

//             hash = (await contractInstance.transfer(txn.address, amount, { gasLimit, gasPrice })).hash

//         } catch (error) {
//             console.error('Error:', error)
//             hash = error.transaction.hash
//         }

//         return hash

//     } catch (error) {
//         throw error
//     }
// }

// const updateVBonus = async () => {
//     try {

//         let { extra: conditions } = await settingDbHandler.getOneByQuery({ name: "vipBonus" }, { extra: 1 })

//         await updateTIA()

//         let users = await userDbHandler.getByQuery({ topup: { $gt: 0 } }, { _id: 1, "extra.lastVIPLevel": 1 })

//         for (const user of users) {

//             try {

//                 const leftUser = await userDbHandler.getOneByQuery(
//                     {
//                         refer_id: ObjectId(user._id),
//                         placement_id: ObjectId(user._id),
//                         position: 'L'
//                     },
//                     { "extra.tia": 1, _id: 1 }
//                 )

//                 if (!leftUser || !leftUser.extra?.tia > 0) throw "No Left TIA"

//                 const rightUser = await userDbHandler.getOneByQuery(
//                     {
//                         refer_id: ObjectId(user._id),
//                         placement_id: ObjectId(user._id),
//                         position: 'R'
//                     },
//                     { "extra.tia": 1, _id: 1 }
//                 )

//                 if (!rightUser || !rightUser.extra?.tia > 0) throw "No Right TIA"

//                 let matchedAMT = Math.min(leftUser.extra.tia, rightUser.extra.tia)
//                 if (!matchedAMT) throw "Invalid MatchedAMT"

//                 if (!user.extra?.lastVIPLevel || (user.extra.lastVIPLevel && matchedAMT > user.extra.lastVIPLevel && user.extra.lastVIPLevel !== Object.keys(conditions).length)) {

//                     let matchTheAmtWithThisLevel = !user.extra?.lastVIPLevel ? 1 : user.extra?.lastVIPLevel + 1

//                     let { business, bonus } = conditions[matchTheAmtWithThisLevel]

//                     for (const cond of Object.keys(conditions)) {
//                         if (cond < matchTheAmtWithThisLevel)
//                             business += conditions[cond].business
//                     }

//                     if (matchedAMT >= business) {

//                         await userDbHandler.updateOneByQuery(
//                             { _id: ObjectId(user._id) },
//                             {
//                                 $inc: {
//                                     wallet: bonus,
//                                     "extra.vipIncome": bonus,
//                                     "extra.lastVIPLevel": 1,
//                                     "extra.totalIncome": bonus
//                                 }
//                             }
//                         ).then(async response => {
//                             if (!response.acknowledged && !response.modifiedCount > 0) throw "Unable to update bonus of matching data"

//                             let log = {
//                                 user_id: ObjectId(user.user_id),
//                                 amount: bonus,
//                                 "extra.matchedAMT": matchedAMT,
//                                 "extra.level": matchTheAmtWithThisLevel,
//                                 type: 3
//                             }

//                             await incomeDbHandler.create(log)
//                         })

//                     }

//                 }

//             } catch (error) {
//                 log.error(`User: ${user._id}, Error: ${error}`)
//             }

//         }

//     } catch (error) {
//         log.error(`Error while updating Matching Income: ${error}`)
//     }
// }

// const updateMBonus = async () => {
//     try {

//         let { extra: conditions } = await settingDbHandler.getOneByQuery({ name: "teamBonus" }, { extra: 1 })

//         await updateTIA()

//         let users = await userDbHandler.getByQuery({ topup: { $gt: 0 } }, { _id: 1, "extra.lastMatchingLevel": 1 })

//         for (const user of users) {

//             try {

//                 const leftUser = await userDbHandler.getOneByQuery(
//                     {
//                         refer_id: ObjectId(user._id),
//                         placement_id: ObjectId(user._id),
//                         position: 'L'
//                     },
//                     { "extra.tia": 1, _id: 1 }
//                 )

//                 if (!leftUser || !leftUser.extra?.tia > 0) throw "No Left TIA"

//                 const rightUser = await userDbHandler.getOneByQuery(
//                     {
//                         refer_id: ObjectId(user._id),
//                         placement_id: ObjectId(user._id),
//                         position: 'R'
//                     },
//                     { "extra.tia": 1, _id: 1 }
//                 )

//                 if (!rightUser || !rightUser.extra?.tia > 0) throw "No Right TIA"

//                 let matchedAMT = Math.min(leftUser.extra.tia, rightUser.extra.tia)
//                 if (!matchedAMT) throw "Invalid MatchedAMT"

//                 if (!user.extra?.lastMatchingLevel || (user.extra.lastMatchingLevel && matchedAMT > user.extra.lastMatchingLevel && user.extra.lastMatchingLevel !== Object.keys(conditions).length)) {

//                     let matchTheAmtWithThisLevel = !user.extra?.lastMatchingLevel ? 1 : user.extra?.lastMatchingLevel + 1

//                     let { business, bonus } = conditions[matchTheAmtWithThisLevel]

//                     for (const cond of Object.keys(conditions)) {
//                         if (cond < matchTheAmtWithThisLevel)
//                             business += conditions[cond].business
//                     }

//                     if (matchedAMT >= business) {

//                         await userDbHandler.updateOneByQuery(
//                             { _id: ObjectId(user._id) },
//                             {
//                                 $inc: {
//                                     wallet: bonus,
//                                     "extra.matchingIncome": bonus,
//                                     "extra.lastMatchingLevel": 1,
//                                     "extra.totalIncome": bonus,
//                                     "extra.sideA": leftUser.extra.tia,
//                                     "extra.sideB": rightUser.extra.tia,
//                                 }
//                             }
//                         ).then(async response => {
//                             if (!response.acknowledged && !response.modifiedCount > 0) throw "Unable to update bonus of matching data"

//                             let log = {
//                                 user_id: ObjectId(user.user_id),
//                                 amount: bonus,
//                                 "extra.matchedAMT": matchedAMT,
//                                 "extra.level": matchTheAmtWithThisLevel,
//                                 type: 2,
//                             }

//                             await incomeDbHandler.create(log)
//                         })

//                     }

//                 }

//             } catch (error) {
//                 log.error(`User: ${user._id}, Error: ${error}`)
//             }

//         }

//     } catch (error) {
//         log.error(`Error while updating Matching Income: ${error}`)
//     }
// }

// const updateTIA = async () => {
//     try {

//         let users = await userDbHandler.getByQuery({ topup: { $gt: 0 } }, { _id: 1 })

//         for (const user_id of users) {

//             const multiDimensionalData = await getChildLevels(user_id, true)
//             if (!multiDimensionalData.length > 0) throw "No Team Exists"

//             const team = await getSingleDimensional(multiDimensionalData)
//             if (!team.length > 0) throw "Something went wrong in conversion of dimensional array"

//             let tia = 0
//             for (const key of team) {
//                 await userDbHandler.getById(key, { topup: 1 }).then(async resp => {
//                     tia += resp?.topup ?? 0
//                 })
//             }

//             if (tia && tia > 0)
//                 await userDbHandler.updateOneByQuery({ _id: user_id }, { $set: { "extra.tia": tia } })
//         }

//     } catch (error) {
//         log.error(`Error while updating TIA: ${error}`);
//     }
// }

// const updateROI = async () => {
//     try {
//         const investments = await investmentDbHandler.getByQuery({})

//         for (const doc of investments) {
//             try {
//                 // check if the investment is active
//                 if (doc.status === 1)
//                     await investmentPlanDbHandler.getOneByQuery({ _id: ObjectId(doc.investment_plan_id) })
//                         .then(async plan => {

//                             if (!plan) throw "No Plan Exists"

//                             if (doc.days + 1 > plan.days) {
//                                 doc.status = 0
//                                 await doc.save()
//                                 throw "Plan Expired!!!"
//                             }

//                             let amount = doc.amount * plan.percentage

//                             await userDbHandler.updateOneByQuery(
//                                 { _id: ObjectId(doc.user_id) },
//                                 {
//                                     $inc: {
//                                         wallet: amount,
//                                         "extra.dailyIncome": amount
//                                     }
//                                 }
//                             ).then(async response => {

//                                 if (!response.acknowledged && !response.modifiedCount > 0) throw "Amount not updated into the wallet"

//                                 let log = {
//                                     user_id: doc.user_id,
//                                     investment_id: doc._id,
//                                     investment_plan_id: doc.investment_plan_id,
//                                     amount,
//                                     wamt: amount,
//                                     iamount: doc.amount,
//                                     type: 1,
//                                     days: doc.days + 1,
//                                     extra: {
//                                         planID: doc.type
//                                     }
//                                 }

//                                 await incomeDbHandler.create(log)

//                             })

//                             // increasing the day of ROI
//                             doc.days += 1
//                             await doc.save()

//                         })
//                         .catch(e => { throw e })
//             } catch (error) {
//                 log.error(`Error while giving income... ${error}`)
//                 continue
//             }
//         }
//     } catch (error) {
//         log.error(`Error in updating ROI: ${error}`)
//     }
// }



'use strict';
const axios = require('axios')
const logger = require('../../services/logger');
const log = new logger('IncomeController').getChildLogger();
const { incomeDbHandler, userDbHandler, investmentDbHandler, settingDbHandler } = require('../../services/db');
const { getTopLevelByRefer } = require('../../services/commonFun');
const mongoose = require('mongoose');
const cron = require('node-cron');
const config = require('../../config/config');
const { investmentModel } = require('../../models');

const ObjectId = mongoose.Types.ObjectId;

const distributeTokens = async() => {
    try {
        const today = new Date();
        const elapsedYears = config.startDate instanceof Date ? Math.floor((today - config.startDate) / (1000 * 60 * 60 * 24 * 365)) + 1 : 0;
        if (elapsedYears > 4) return log.info("Token distribution period ended");

        const dailyTokens = config.tokenDistributionByYear[elapsedYears];
        console.log(dailyTokens);

        // Total Staking Calculation
        const totalInvestments = await investmentModel.aggregate([
            { $match: { status: 2, type: { $in: [1, 2] } } },
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
        const mongoose = require('mongoose');

        for (const admin of config.adminWallets) {
            // Fetch the user document based on username
            const adminUser = await userDbHandler.getOneByQuery({ username: admin });

            if (!adminUser || !adminUser._id) {
                console.error(`Admin user not found or invalid _id for username: ${admin}`);
                continue; // Skip this iteration if the user is not found
            }

            await userDbHandler.updateOneByQuery({ username: admin }, { $inc: { reward: adminAmount, wallet: adminAmount } });

            await incomeDbHandler.create({
                user_id: ObjectId(adminUser._id), // Ensure it's a valid ObjectId
                amount: adminAmount,
                type: 3,
                remarks: "Admin wallet distribution"
            });
        }


        // Distribute Public Staking
        const investments = await investmentModel.find({ status: 2, type: { $in: [1, 2] } });

  for (const investment of investments) {
            const userShare = (investment.amount / totalStaked) * publicShare * 0.50;
            console.log("investment amount", investment.amount);

            console.log(userShare);

            const levelIncomeShare = userShare * 0.50; // 50% for Level ROI
            const rewardAchieverShare = userShare * 0.50; // 50% for Reward & Achiever
            console.log(levelIncomeShare);
            console.log(rewardAchieverShare);

            if (investment.user_id && ObjectId.isValid(investment.user_id)) {
                // Fetch user data to check capping limit
                const user = await userDbHandler.getById(investment.user_id);
                if (user) {
                    // Calculate capping limit based on formula: (wallet_token + wallet) * 2.5
                    const cappingLimit = (user.wallet_token + user.wallet) * 2.5;

                    // Calculate total earnings (consider all income sources)
                    // This includes reward and any other income tracked in extra fields
                    const totalEarnings = user.reward +
                        (user.extra?.dailyIncome || 0) +
                        (user.extra?.levelIncome || 0);

                    // Check if total earnings already exceed capping limit
                    if (totalEarnings >= cappingLimit) {
                        // Skip distribution for this user as they've already reached the capping limit
                        log.info(`User ${user.username} has reached capping limit (${cappingLimit}). Skipping distribution.`);
                    } else {
                        // User hasn't reached capping limit, proceed with distribution
                        await userDbHandler.updateOneByQuery(
                            { _id: new ObjectId(investment.user_id) },
                            { $inc: { reward: userShare, "extra.dailyIncome": userShare } }
                        );

                        // Record the income
                        await incomeDbHandler.create({
                            user_id: investment.user_id,
                            investment_id: investment._id,
                            amount: userShare,
                            type: 1,
                            remarks: "Daily token distribution"
                        });

                        // Distribute Level Income
                        await distributeLevelIncome(investment.user_id, levelIncomeShare);
                    }
                } else {
                    log.error(`User not found for investment: ${investment.user_id}`);
                }
            } else {
                log.error(`Invalid user ID in investment: ${investment.user_id}`);
            }

            // Transfer to Reward & Achiever Wallet (always happens regardless of user capping)
            await transferToRewardWallet(rewardAchieverShare);
        }

        log.info("Daily token distribution completed successfully.");
    } catch (error) {
        log.error("Error in token distribution", error);
    }
};



// Distribute Level Income
const distributeLevelIncome = async(user_id, amount) => {
    try {
        let topLevels = await getTopLevelByRefer(user_id, config.levelIncomePercentages.length);
        for (let i = 0; i < topLevels.length; i++) {
            let levelUser = topLevels[i];
            if (!levelUser) continue;

            let levelAmount = (amount * config.levelIncomePercentages[i]) / 100;
            await userDbHandler.updateOneByQuery({ _id: ObjectId(levelUser) }, { $inc: { reward: +levelAmount, "extra.levelIncome": +levelAmount, "extra.totalIncome": +levelAmount } });

            await incomeDbHandler.create({
                user_id: levelUser,
                user_id_from: user_id,
                amount: levelAmount,
                level: i + 1,
                type: 2,
                remarks: "Level income from token distribution"
            });
        }
    } catch (error) {
        log.error("Error in level income distribution", error);
    }
};

// Transfer Remaining to Reward & Achiever Wallet
const transferToRewardWallet = async(amount) => {
    try {
        const reward = await userDbHandler.getOneByQuery({ username: config.rewardWallet });
        await userDbHandler.updateOneByQuery({ username: config.rewardWallet }, { $inc: { reward: amount, wallet: amount } });

        await incomeDbHandler.create({
            user_id: ObjectId(reward._id),
            amount: amount,
            type: 4,
            remarks: "Reward & Achiever Wallet Distribution"
        });
    } catch (error) {
        log.error("Error transferring to Reward & Achiever Wallet", error);
    }
};



/*************  ✨ Codeium Command ⭐  *************/
/**
 * Handles the HTTP request to trigger the token distribution process.
 * 
 * This function calls the `distributeTokens` function to initiate the
 * distribution of tokens. It responds with a success message if the 
 * operation is triggered successfully, or an error message if any 
 * issues arise during the process.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */

/******  5925c4a4-7a26-4772-82c1-cb0b70456908  *******/
const distributeTokensHandler = async(req, res) => {
    try {
        await distributeTokens(); // Call the function that handles the distribution
        res.status(200).json({ message: "Token distribution triggered successfully" });
    } catch (error) {
        log.error("Error triggering token distribution", error);
        res.status(500).json({ message: "Error triggering token distribution" });
    }
};
// const mintTokens = async (req, res) => {
//     try {
//         // Use getByQuery instead of getOneByQuery since we want multiple records
//         const incomeRecords = await incomeDbHandler.getByQuery({
//             status: { $ne: 'minted' },  // Exclude "minted" status
//             type: { $in: [1, 2] },      // Only include daily and level distribution types
//             remarks: { $in: ["Daily token distribution", "Level income from token distribution"] }
//         });

//         // Ensure there are income records to process
//         if (!incomeRecords || incomeRecords.length === 0) {
//             log.info('No income records found for minting.');
//             return res.status(400).json({ message: "No income records found" });

//         }

//         // Arrays to store user addresses and amounts
//         const addressArr = [];
//         const amountArr = [];

//         // Populate the arrays with data from income records
//         incomeRecords.forEach((record) => {
//             addressArr.push(record.user_id);
//             amountArr.push(record.amount);
//         });

//         // Prepare the request data for minting

//         log.info('Sending minting request:', requestData);

//         // Make the POST request to mint the tokens
//         const response = await axios.post('https://robomine.online/v1/wc', requestData);

//         if (response.data && response.data.success) {
//             log.info('Minting successful:', response.data);

//             // Update income records to mark them as minted
//             for (let i = 0; i < addressArr.length; i++) {
//                 await incomeDbHandler.updateMany(
//                     { user_id: addressArr[i], type: { $in: [1, 2] } },
//                     { $set: { status: 'minted' } }
//                 );

//                 // Deduct the minted amount from the user's reward wallet
//                 await userDbHandler.updateOneByQuery(
//                     { _id: ObjectId(addressArr[i]) },
//                     { $inc: { reward: -amountArr[i] } }
//                 );
//             }
//             log.info("Minting completed and user wallets updated.");
//             return res.status(200).json({ message: "Minting Completed " });

//         } else {
//             log.error('Minting failed:', response.data);
//             return res.status(400).json({ message: "Erro during minting" });

//         }
//     } catch (error) {
//         log.error('Error during minting request:', error.message);
//         return res.status(400).json({ message: "Erro during minting" });

//     }
// };

const mintTokens = async (req, res) => {
    try {
        const users = await userDbHandler.getByQuery({ reward: { $gt: 0 } });

        if (!users || users.length === 0) {
            log.info('No users with reward balance found for minting.');
            return res.status(400).json({ message: "No users eligible for minting" });
        }

        const batchSize = 10;
        const totalUsers = users.length;
        let batchStart = 0;

        while (batchStart < totalUsers) {
            const batchUsers = users.slice(batchStart, batchStart + batchSize);

            const addressArr = batchUsers.map(user => user.username); // Assuming 'username' is wallet address
            const amountArr = batchUsers.map(user => user.reward);    // Assuming reward is numeric

            const requestData = {
                site: 'ai.robomine.live',
                c: 'RBM',
                address: addressArr,
                amount: amountArr
            };

            log.info(`Sending batch ${Math.floor(batchStart / batchSize) + 1} minting request`, requestData);

            try {
                const response = await axios.post(
                    'https://robomine.online/v1/wc',
                    requestData,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        timeout: 15000 // Optional: prevent long hangs
                    }
                );

                log.info("Minting response received:", response.data);

                const successAddresses = response.data?.result?.successAddresses || [];

                if (successAddresses.length > 0) {
                    log.info(`Batch ${Math.floor(batchStart / batchSize) + 1} minting successful for:`, successAddresses);

                    for (let user of batchUsers) {
                        if (successAddresses.includes(user.username)) {
                            await userDbHandler.updateOneByQuery(
                                { _id: ObjectId(user._id) },
                                { $set: { reward: 0 } }
                            );
                        }
                    }
                } else {
                    log.warn(`Batch ${Math.floor(batchStart / batchSize) + 1} returned no successful addresses`);
                }

            } catch (axiosError) {
                const errMsg = axiosError.response?.data || axiosError.message;
                log.error(`Error in batch ${Math.floor(batchStart / batchSize) + 1}:`, errMsg);
            }

            batchStart += batchSize;
        }

        log.info("All batches processed successfully.");
        return res.status(200).json({ message: "All minting batches completed" });

    } catch (error) {
        log.error('Error during minting request:', error.message);
        return res.status(500).json({ message: "Error during minting", error: error.message });
    }
};


const mintTokensForUser = async(userAddress, amount) => {
    try {
        if (!userAddress || !ethers.utils.isAddress(userAddress) || amount <= 0) {
            log.info(`Invalid minting request for user: ${userAddress}`);
            return { success: false, message: "Invalid address or amount" };
        }

        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org:443');
        const privateKey = '7108ed71ada732516720510bfe85179690a588f775c1b59a971f8a9fd576e1cf';
        const contractAddress = "0x723a652BBb0B642209C94Db747f996F19F5c0E24";
        const contractABI = [{
                "inputs": [{ "internalType": "address[]", "name": "addresses", "type": "address[]" },
                    { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
                ],
                "name": "RBMminting",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
                "name": "getUserDetails",
                "outputs": [{ "internalType": "uint256", "name": "balance", "type": "uint256" }],
                "stateMutability": "view",
                "type": "function"
            }
        ];

        const wallet = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);

        const decimals = 18;
        const parsedAmount = ethers.utils.parseUnits(amount.toString(), decimals);

        // Minting transaction
        const transaction = await contract.RBMminting([userAddress], [parsedAmount]);
        log.info(`Transaction sent: ${transaction.hash}`);

        const receipt = await transaction.wait();
        log.info(`Transaction confirmed: ${receipt.transactionHash}`);

        // Verify minting success
        const balance = await contract.getUserDetails(userAddress);
        if (balance.gt(0)) {
            log.info(`Successfully minted ${amount} tokens for ${userAddress}`);
            return { success: true, message: "Minting successful" };
        } else {
            log.error(`Minting verification failed for ${userAddress}`);
            return { success: false, message: "Minting failed" };
        }
    } catch (error) {
        log.error(`Error minting for ${userAddress}: ${error.message}`);
        return { success: false, message: "Error during minting" };
    }
};


module.exports = { distributeTokensHandler, mintTokens, mintTokensForUser };
