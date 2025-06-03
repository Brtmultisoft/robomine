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
    log.info('=== MINTING PROCESS STARTED ===');
    log.info(`Minting process initiated at: ${new Date().toISOString()}`);

    try {
        // Add a lock mechanism to prevent concurrent minting
        const lockKey = 'minting_in_progress';
        log.info(`[STEP 1] Checking minting lock status with key: ${lockKey}`);
        const lockStatus = await settingDbHandler.getOneByQuery({ name: lockKey });

        if (lockStatus && lockStatus.value === 'true') {
            log.warn('[STEP 1] Minting process already in progress. Skipping this run.');
            return res.status(409).json({ message: "Minting process already in progress" });
        }

        // Set the lock
        log.info('[STEP 1] Setting minting lock to prevent concurrent execution');
        await settingDbHandler.updateOneByQuery(
            { name: lockKey },
            { $set: { value: 'true' } },
            { upsert: true }
        );
        log.info('[STEP 1] Minting lock successfully set');

        try {
            // Get users with reward balance, excluding admin wallets
            log.info('[STEP 2] Fetching users with positive reward balances');
            const allUsers = await userDbHandler.getByQuery({ reward: { $gt: 0 } });

            if (!allUsers || allUsers.length === 0) {
                log.info('[STEP 2] No users with reward balance found for minting.');
                return res.status(400).json({ message: "No users eligible for minting" });
            }

            // Filter out admin wallet addresses
            const users = allUsers.filter(user => {
                const isAdminWallet = config.adminWallets.includes(user.username);
                if (isAdminWallet) {
                    log.info(`[STEP 2] Skipping admin wallet: ${user.username} (reward: ${user.reward})`);
                }
                return !isAdminWallet;
            });

            if (users.length === 0) {
                log.info('[STEP 2] No non-admin users with reward balance found for minting.');
                return res.status(400).json({ message: "No eligible users for minting (all users are admin wallets)" });
            }

            log.info(`[STEP 2] Found ${allUsers.length} total users with positive reward balances, ${users.length} eligible for minting (${allUsers.length - users.length} admin wallets excluded)`);

            // Process users with large balances by splitting them into smaller batches
            const MAX_TRANSACTION_AMOUNT = 4500; // Maximum amount per transaction to prevent failures
            const batchSize = 10; // Maximum number of users per batch

            log.info(`[STEP 3] Preparing minting batches with MAX_TRANSACTION_AMOUNT=${MAX_TRANSACTION_AMOUNT} and batchSize=${batchSize}`);

            // Prepare batches with split transactions for large balances
            const mintingBatches = [];
            let largeBalanceUsers = 0;
            let totalTransactions = 0;

            // Validate and prepare transactions
            log.info('[STEP 3] Processing each user and splitting large balances');
            for (const user of users) {
                const username = user.username;
                // Ensure reward is treated as a number and rounded to 6 decimal places to avoid floating point issues
                const totalReward = parseFloat(parseFloat(user.reward).toFixed(6));

                // Skip users with invalid usernames (addresses) or zero/negative rewards
                if (!username || totalReward <= 0) {
                    log.warn(`[STEP 3] Skipping user with invalid data: ID=${user._id}, username=${username}, reward=${totalReward}`);
                    continue;
                }

                // If user's reward is less than or equal to the max amount, add as a single transaction
                if (totalReward <= MAX_TRANSACTION_AMOUNT) {
                    mintingBatches.push({
                        username,
                        amount: totalReward,
                        userId: user._id,
                        isPartial: false,
                        totalAmount: totalReward
                    });
                    totalTransactions++;
                    log.debug(`[STEP 3] User ${username} (ID: ${user._id}) added as single transaction with amount ${totalReward}`);
                } else {
                    // Split large balances into multiple transactions
                    largeBalanceUsers++;
                    // Use Math.floor to ensure we don't exceed the max amount
                    const fullBatches = Math.floor(totalReward / MAX_TRANSACTION_AMOUNT);
                    // Calculate remainder precisely to avoid floating point errors
                    const remainder = parseFloat((totalReward - (fullBatches * MAX_TRANSACTION_AMOUNT)).toFixed(6));

                    log.info(`[STEP 3] Splitting large balance for user ${username} (ID: ${user._id}): ${totalReward} into ${fullBatches} full batches of ${MAX_TRANSACTION_AMOUNT} each with remainder ${remainder}`);

                    // Add full-sized batches
                    for (let i = 0; i < fullBatches; i++) {
                        mintingBatches.push({
                            username,
                            amount: MAX_TRANSACTION_AMOUNT,
                            userId: user._id,
                            isPartial: true,
                            totalAmount: totalReward,
                            batchNumber: i + 1,
                            totalBatches: fullBatches + (remainder > 0 ? 1 : 0)
                        });
                        totalTransactions++;
                        log.debug(`[STEP 3] Added batch ${i+1}/${fullBatches + (remainder > 0 ? 1 : 0)} for user ${username} with amount ${MAX_TRANSACTION_AMOUNT}`);
                    }

                    // Add remainder batch if needed
                    if (remainder > 0) {
                        mintingBatches.push({
                            username,
                            amount: remainder,
                            userId: user._id,
                            isPartial: true,
                            totalAmount: totalReward,
                            batchNumber: fullBatches + 1,
                            totalBatches: fullBatches + 1
                        });
                        totalTransactions++;
                        log.debug(`[STEP 3] Added remainder batch ${fullBatches+1}/${fullBatches + 1} for user ${username} with amount ${remainder}`);
                    }
                }
            }

            log.info(`[STEP 3] Batch preparation complete: ${users.length} total users, ${largeBalanceUsers} users with large balances, ${totalTransactions} total transactions`);
            if (largeBalanceUsers > 0) {
                log.info(`[STEP 3] ${largeBalanceUsers} users had balances greater than ${MAX_TRANSACTION_AMOUNT} and were split into multiple transactions`);
            }

            // Process the prepared batches
            log.info(`[STEP 4] Beginning minting process for ${mintingBatches.length} total transactions across ${users.length} users`);

            // Track successful minting for each user
            log.info('[STEP 4] Initializing minting status tracking for each user');
            const userMintingStatus = {};
            users.forEach(user => {
                userMintingStatus[user._id.toString()] = {
                    totalAmount: parseFloat(parseFloat(user.reward).toFixed(6)),
                    mintedAmount: 0,
                    success: false
                };
            });

            // Process batches in groups of batchSize
            const totalBatches = Math.ceil(mintingBatches.length / batchSize);
            log.info(`[STEP 4] Will process ${totalBatches} API batches with up to ${batchSize} transactions each`);

            for (let i = 0; i < mintingBatches.length; i += batchSize) {
                const currentBatch = mintingBatches.slice(i, i + batchSize);
                const batchNumber = Math.floor(i / batchSize) + 1;

                log.info(`[STEP 4] Processing API batch ${batchNumber}/${totalBatches} with ${currentBatch.length} transactions`);

                const addressArr = currentBatch.map(item => item.username);
                const amountArr = currentBatch.map(item => item.amount);

                // Log transaction details for this batch
                currentBatch.forEach((tx, idx) => {
                    log.info(`[STEP 4] Batch ${batchNumber} Transaction ${idx+1}: User=${tx.username}, Amount=${tx.amount}, ${tx.isPartial ? `Partial (${tx.batchNumber}/${tx.totalBatches})` : 'Full'}`);
                });

                const requestData = {
                    site: 'ai.robomine.live',
                    c: 'RBM',
                    address: addressArr,
                    amount: amountArr
                };

                log.info(`[STEP 4] Sending API request for batch ${batchNumber}/${totalBatches}`);

                try {
                    const startTime = Date.now();
                    log.info(`[STEP 4] API request started at ${new Date(startTime).toISOString()}`);

                    const response = await axios.post(
                        'https://robomine.online/v1/wc',
                        requestData,
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            timeout: 30000 // Increased timeout for larger batches
                        }
                    );

                    const endTime = Date.now();
                    const duration = endTime - startTime;
                    log.info(`[STEP 4] API request completed in ${duration}ms with status ${response.status}`);

                    // Check response structure
                    if (!response.data) {
                        log.warn(`[STEP 4] Batch ${batchNumber}/${totalBatches}: Empty response data`);
                        continue;
                    }

                    const successAddresses = response.data?.result?.successAddresses || [];
                    log.info(`[STEP 4] Batch ${batchNumber}/${totalBatches}: ${successAddresses.length}/${currentBatch.length} transactions successful`);

                    if (successAddresses.length > 0) {
                        // Log all successful addresses
                        log.info(`[STEP 4] Batch ${batchNumber}/${totalBatches} successful addresses: ${JSON.stringify(successAddresses)}`);

                        // Update minting status for each transaction in the batch
                        for (const transaction of currentBatch) {
                            if (successAddresses.includes(transaction.username)) {
                                const userId = transaction.userId.toString();

                                // Update the minted amount for this user
                                userMintingStatus[userId].mintedAmount += transaction.amount;
                                const newMintedTotal = userMintingStatus[userId].mintedAmount;

                                // If this was a partial transaction, check if all parts are complete
                                if (transaction.isPartial) {
                                    // Compare with a small epsilon to account for floating point errors
                                    const totalAmount = userMintingStatus[userId].totalAmount;
                                    const difference = Math.abs(newMintedTotal - totalAmount);

                                    if (difference < 0.000001) {
                                        userMintingStatus[userId].success = true;
                                        log.info(`[STEP 4] User ${transaction.username} (ID: ${userId}): All partial transactions complete! Total minted: ${newMintedTotal}`);
                                    }

                                    log.info(`[STEP 4] Partial minting successful for user ${transaction.username} (ID: ${userId}): ${transaction.amount} tokens (Batch ${transaction.batchNumber}/${transaction.totalBatches}). Progress: ${newMintedTotal}/${totalAmount}`);
                                } else {
                                    userMintingStatus[userId].success = true;
                                    log.info(`[STEP 4] Full minting successful for user ${transaction.username} (ID: ${userId}): ${transaction.amount} tokens`);
                                }
                            } else {
                                log.warn(`[STEP 4] Transaction failed for user ${transaction.username}, amount ${transaction.amount}`);
                            }
                        }
                    } else {
                        log.warn(`[STEP 4] Batch ${batchNumber}/${totalBatches} returned no successful addresses`);
                    }

                } catch (axiosError) {
                    const errMsg = axiosError.response?.data || axiosError.message;
                    log.error(`[STEP 4] Error in batch ${batchNumber}/${totalBatches}:`, errMsg);
                    if (axiosError.stack) {
                        log.error(`[STEP 4] Error stack trace:`, axiosError.stack);
                    }
                }

                // Add a small delay between batches to prevent rate limiting
                if (i + batchSize < mintingBatches.length) {
                    const delayMs = 2000;
                    log.info(`[STEP 4] Adding ${delayMs}ms delay before next batch to prevent rate limiting`);
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                }
            }

            // Log summary of minting results
            let successfulUsers = 0;
            let partialUsers = 0;
            let failedUsers = 0;

            Object.keys(userMintingStatus).forEach(userId => {
                const status = userMintingStatus[userId];
                if (status.success) {
                    successfulUsers++;
                } else if (status.mintedAmount > 0) {
                    partialUsers++;
                } else {
                    failedUsers++;
                }
            });

            log.info(`[STEP 4] Minting summary: ${successfulUsers} users fully successful, ${partialUsers} users partially successful, ${failedUsers} users failed`);


            // Update user rewards based on minting status
            log.info('[STEP 5] Updating user reward balances based on minting results');
            let updatedUsers = 0;
            let totalMinted = 0;

            for (const user of users) {
                const userId = user._id.toString();
                const status = userMintingStatus[userId];

                if (!status) {
                    log.warn(`[STEP 5] No minting status found for user ${user.username} (ID: ${userId}). Skipping update.`);
                    continue; // Skip if no status (should not happen)
                }

                if (status.success) {
                    // If all minting was successful, reset the reward to 0
                    log.info(`[STEP 5] User ${user.username} (ID: ${userId}): All minting successful (${status.mintedAmount} tokens). Resetting reward to 0.`);

                    try {
                        await userDbHandler.updateOneByQuery(
                            { _id: ObjectId(userId) },
                            { $set: { reward: 0 } }
                        );
                        updatedUsers++;
                        totalMinted += status.mintedAmount;
                        log.info(`[STEP 5] Successfully reset reward to 0 for user ${user.username} (ID: ${userId})`);
                    } catch (dbError) {
                        log.error(`[STEP 5] Database error updating user ${user.username} (ID: ${userId}):`, dbError.message);
                    }
                } else if (status.mintedAmount > 0) {
                    // If partial minting was successful, reduce the reward by the minted amount
                    const remainingReward = Math.max(0, parseFloat((status.totalAmount - status.mintedAmount).toFixed(6)));
                    log.info(`[STEP 5] User ${user.username} (ID: ${userId}): Partial minting successful (${status.mintedAmount}/${status.totalAmount} tokens). Setting reward to ${remainingReward}.`);

                    try {
                        await userDbHandler.updateOneByQuery(
                            { _id: ObjectId(userId) },
                            { $set: { reward: remainingReward } }
                        );
                        updatedUsers++;
                        totalMinted += status.mintedAmount;
                        log.info(`[STEP 5] Successfully updated reward to ${remainingReward} for user ${user.username} (ID: ${userId})`);
                    } catch (dbError) {
                        log.error(`[STEP 5] Database error updating user ${user.username} (ID: ${userId}):`, dbError.message);
                    }
                } else {
                    log.info(`[STEP 5] User ${user.username} (ID: ${userId}): No successful minting. Reward remains at ${status.totalAmount}.`);
                }
            }

            log.info(`[STEP 5] Database updates complete: ${updatedUsers} users updated, ${totalMinted} total tokens minted`);
            log.info("=== MINTING PROCESS COMPLETED SUCCESSFULLY ===");

            // Return success response with detailed statistics
            return res.status(200).json({
                message: "All minting batches completed",
                statistics: {
                    totalUsers: users.length,
                    usersUpdated: updatedUsers,
                    totalTokensMinted: totalMinted,
                    fullySuccessful: successfulUsers,
                    partiallySuccessful: partialUsers,
                    failed: failedUsers
                }
            });

        } finally {
            // Always release the lock, even if there was an error
            try {
                log.info('[CLEANUP] Releasing minting lock');
                await settingDbHandler.updateOneByQuery(
                    { name: lockKey },
                    { $set: { value: 'false' } }
                );
                log.info("[CLEANUP] Minting lock successfully released");
            } catch (lockError) {
                log.error('[CLEANUP] Error releasing minting lock:', lockError.message);
            }

            log.info(`[CLEANUP] Minting process ended at: ${new Date().toISOString()}`);
        }

    } catch (error) {
        log.error('=== MINTING PROCESS FAILED ===');
        log.error('Error during minting request:', error.message);
        log.error('Stack trace:', error.stack);
        return res.status(500).json({
            message: "Error during minting",
            error: error.message,
            time: new Date().toISOString()
        });
    }
};


const mintTokensForUser = async(userAddress, amount) => {
    try {
        if (!userAddress || !ethers.utils.isAddress(userAddress) || amount <= 0) {
            log.info(`Invalid minting request for user: ${userAddress}`);
            return { success: false, message: "Invalid address or amount" };
        }

        // Check if the user address is an admin wallet and skip minting
        if (config.adminWallets.includes(userAddress)) {
            log.info(`Skipping minting for admin wallet: ${userAddress}`);
            return { success: false, message: "Minting not allowed for admin wallets" };
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


// Helper function to check user qualification for star ranking
const checkUserQualification = async (user, criteria) => {
    try {
        const userId = user._id;

        // Get direct referrals (direct team members)
        const directReferrals = await userDbHandler.getByQuery({ refer_id: ObjectId(userId) });
        const directMembersCount = directReferrals.length;

        // Get all team members (using the existing function)
        const allTeamMembers = await getTopLevelByRefer(userId, 10); // Get up to 10 levels
        const teamMembersCount = allTeamMembers.length;

        // Calculate direct business (investments from direct referrals)
        let directBusiness = 0;
        for (const directRef of directReferrals) {
            const directInvestments = await investmentDbHandler.getByQuery({
                user_id: ObjectId(directRef._id),
                status: 2 // Active investments
            });
            directBusiness += directInvestments.reduce((sum, inv) => sum + inv.amount, 0);
        }

        // Calculate total team business
        let teamBusiness = 0;
        for (const teamMember of allTeamMembers) {
            const teamInvestments = await investmentDbHandler.getByQuery({
                user_id: ObjectId(teamMember),
                status: 2
            });
            teamBusiness += teamInvestments.reduce((sum, inv) => sum + inv.amount, 0);
        }

        // Calculate any leg business (highest single leg business)
        let anyLegBusiness = 0;
        if (criteria.anyLegBusiness) {
            for (const directRef of directReferrals) {
                const legMembers = await getTopLevelByRefer(directRef._id, 10);
                let legBusiness = 0;

                // Include direct referral's business
                const directRefInvestments = await investmentDbHandler.getByQuery({
                    user_id: ObjectId(directRef._id),
                    status: 2
                });
                legBusiness += directRefInvestments.reduce((sum, inv) => sum + inv.amount, 0);

                // Include leg members' business
                for (const legMember of legMembers) {
                    const legInvestments = await investmentDbHandler.getByQuery({
                        user_id: ObjectId(legMember),
                        status: 2
                    });
                    legBusiness += legInvestments.reduce((sum, inv) => sum + inv.amount, 0);
                }

                anyLegBusiness = Math.max(anyLegBusiness, legBusiness);
            }
        }

        // Check self stake requirement
        let hasSelfStake = true;
        if (criteria.requiresSelfStake) {
            const userInvestments = await investmentDbHandler.getByQuery({
                user_id: ObjectId(userId),
                status: 2
            });
            hasSelfStake = userInvestments.length > 0;
        }

        // Check time limit for 1 STAR (30 days from registration)
        let withinTimeLimit = true;
        if (criteria.timeLimit) {
            const registrationDate = new Date(user.created_at);
            const daysSinceRegistration = Math.floor((new Date() - registrationDate) / (1000 * 60 * 60 * 24));
            withinTimeLimit = daysSinceRegistration <= criteria.timeLimit;
        }

        // Check all criteria
        const qualified =
            directMembersCount >= criteria.directMembers &&
            teamMembersCount >= criteria.teamMembers &&
            (!criteria.directBusiness || directBusiness >= criteria.directBusiness) &&
            (!criteria.teamBusiness || teamBusiness >= criteria.teamBusiness) &&
            (!criteria.anyLegBusiness || anyLegBusiness >= criteria.anyLegBusiness) &&
            hasSelfStake &&
            withinTimeLimit;

        log.info(`User ${user.username} qualification check:`, {
            directMembers: `${directMembersCount}/${criteria.directMembers}`,
            teamMembers: `${teamMembersCount}/${criteria.teamMembers}`,
            directBusiness: `${directBusiness}/${criteria.directBusiness || 'N/A'}`,
            teamBusiness: `${teamBusiness}/${criteria.teamBusiness || 'N/A'}`,
            anyLegBusiness: `${anyLegBusiness}/${criteria.anyLegBusiness || 'N/A'}`,
            hasSelfStake: `${hasSelfStake}/${criteria.requiresSelfStake || false}`,
            withinTimeLimit: `${withinTimeLimit}/${criteria.timeLimit || 'N/A'} days`,
            qualified
        });

        return {
            qualified,
            stats: {
                directMembersCount,
                teamMembersCount,
                directBusiness,
                teamBusiness,
                anyLegBusiness,
                hasSelfStake,
                withinTimeLimit
            }
        };

    } catch (error) {
        log.error(`Error checking qualification for user ${user.username}:`, error.message);
        return { qualified: false, error: error.message };
    }
};

// Star ranking qualification system
const checkStarRankings = async (req, res) => {
    log.info('=== STAR RANKING CHECK STARTED ===');
    log.info(`Star ranking check initiated at: ${new Date().toISOString()}`);

    try {
        // Define star ranking criteria
        const starCriteria = {
            1: {
                name: "1 STAR",
                reward: 250, // $250 worth token
                rewardType: "RBM_TOKEN",
                directMembers: 5,
                teamMembers: 15,
                directBusiness: 3000,
                timeLimit: 30 // days
            },
            2: {
                name: "2 STAR",
                reward: 500, // $500 E-WALLET P2P
                rewardType: "E_WALLET",
                directMembers: 10,
                teamMembers: 50,
                teamBusiness: 10000,
                directBusiness: 5000,
                anyLegBusiness: 5000,
                requiresSelfStake: true
            },
            3: {
                name: "3 STAR",
                reward: 1000, // $1000
                rewardType: "E_WALLET",
                directMembers: 15,
                teamMembers: 100,
                teamBusiness: 20000,
                directBusiness: 10000,
                anyLegBusiness: 10000
            },
            5: {
                name: "5 STAR",
                reward: 5000, // $5000
                rewardType: "E_WALLET",
                directMembers: 25,
                teamMembers: 300,
                teamBusiness: 50000,
                directBusiness: 25000,
                anyLegBusiness: 25000
            }
        };

        // Get all active users
        const users = await userDbHandler.getByQuery({ status: true });
        log.info(`Found ${users.length} active users to check for star rankings`);

        let processedUsers = 0;
        let promotedUsers = 0;
        let rewardedUsers = 0;

        for (const user of users) {
            try {
                processedUsers++;
                log.info(`[${processedUsers}/${users.length}] Checking user: ${user.username} (ID: ${user._id})`);

                // Get user's current rank
                const currentRank = user.extra?.rank || 0;
                let newRank = currentRank;
                let qualifiedForReward = false;

                // Check each star level (starting from highest to lowest)
                for (const [starLevel, criteria] of Object.entries(starCriteria).reverse()) {
                    const star = parseInt(starLevel);

                    // Skip if user already has this rank or higher
                    if (currentRank >= star) continue;

                    log.info(`Checking ${criteria.name} qualification for user ${user.username}`);

                    // Check if user meets all criteria for this star level
                    const qualification = await checkUserQualification(user, criteria);

                    if (qualification.qualified) {
                        newRank = star;
                        qualifiedForReward = true;
                        log.info(`User ${user.username} qualified for ${criteria.name}!`);
                        break; // Take the highest qualification
                    }
                }

                // Update user rank and award bonus if qualified
                if (newRank > currentRank) {
                    const criteria = starCriteria[newRank];

                    // Update user rank
                    await userDbHandler.updateOneByQuery(
                        { _id: ObjectId(user._id) },
                        {
                            $set: {
                                "extra.rank": newRank,
                                "extra.rankAchievedAt": new Date()
                            },
                            $inc: {
                                "extra.dailyBonus": criteria.reward,
                                "extra.totalBonus": criteria.reward,
                                "extra.totalIncome": criteria.reward
                            }
                        }
                    );

                    // Add to wallet based on reward type
                    if (criteria.rewardType === "RBM_TOKEN") {
                        await userDbHandler.updateOneByQuery(
                            { _id: ObjectId(user._id) },
                            { $inc: { reward: criteria.reward } }
                        );
                    } else if (criteria.rewardType === "E_WALLET") {
                        await userDbHandler.updateOneByQuery(
                            { _id: ObjectId(user._id) },
                            { $inc: { wallet: criteria.reward } }
                        );
                    }

                    // Create income record
                    await incomeDbHandler.create({
                        user_id: ObjectId(user._id),
                        amount: criteria.reward,
                        type: 5, // Star ranking bonus
                        remarks: `${criteria.name} qualification bonus - ${criteria.rewardType}`,
                        extra: {
                            rankAchieved: newRank,
                            rankName: criteria.name,
                            rewardType: criteria.rewardType
                        }
                    });

                    promotedUsers++;
                    rewardedUsers++;

                    log.info(`User ${user.username} promoted to ${criteria.name} and awarded ${criteria.reward} ${criteria.rewardType}`);
                }

            } catch (userError) {
                log.error(`Error processing user ${user.username} (ID: ${user._id}):`, userError.message);
            }
        }

        log.info(`Star ranking check completed: ${processedUsers} users processed, ${promotedUsers} users promoted, ${rewardedUsers} users rewarded`);
        log.info('=== STAR RANKING CHECK COMPLETED ===');

        if (res) {
            return res.status(200).json({
                message: "Star ranking check completed successfully",
                statistics: {
                    totalUsers: users.length,
                    processedUsers,
                    promotedUsers,
                    rewardedUsers
                }
            });
        }

    } catch (error) {
        log.error('=== STAR RANKING CHECK FAILED ===');
        log.error('Error during star ranking check:', error.message);
        log.error('Stack trace:', error.stack);

        if (res) {
            return res.status(500).json({
                message: "Error during star ranking check",
                error: error.message
            });
        }
    }
};

module.exports = { distributeTokensHandler, mintTokens, mintTokensForUser, checkStarRankings };
