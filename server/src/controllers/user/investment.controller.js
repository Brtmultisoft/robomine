'use strict';
const logger = require('../../services/logger');
const log = new logger('InveatmentController').getChildLogger();
const { investmentDbHandler, investmentPlanDbHandler, userDbHandler, incomeDbHandler, settingDbHandler } = require('../../services/db');
const { getTopLevelByRefer } = require('../../services/commonFun');
const responseHelper = require('../../utils/customResponse');
const config = require('../../config/config');
const {ethers} = require("ethers")
const { userModel } = require('../../models');
const {distributeLevelIncome, distributeGlobalAutoPoolMatrixIncome} = require("./cron.controller")

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { now } = require('mongoose')

const createInvestmentPackages = async (user_id, slotValue, amount) => {
    const packages = ['x3', 'x6', 'x9'];
    const investments = [];

    try {
        // Create investment entries for all three packages
        for (const packageType of packages) {
            const investment = await investmentDbHandler.create({
                user_id,
                slot_value: slotValue,
                amount: amount,
                package_type: packageType,
                status: 1
            });
            investments.push(investment);
        }

        // Update user's total investment
        // let user = await userDbHandler.getById(user_id);
        // if (!user) {
        //     throw new Error('User not found');
        // }

        // const updateResult = await userDbHandler.updateById(user_id, {
        //     $inc: { total_investment: slotValue * 3 },
        //     $push: {
        //         packages: packages.map(type => ({
        //             type,
        //             amount: amount,
        //             status: true,
        //             created_at: new Date()
        //         }))
        //     }
        // });
        // console.log(updateResult)
        // if (!updateResult) {
        //     throw new Error('Failed to update user investment details');
        // }

        return investments;
    } catch (error) {
        log.error('Failed to create investment packages:', error);
        throw error;
    }
};

module.exports = {

    getAll: async (req, res) => {
        let reqObj = req.query;
        let user = req.user;
        let user_id = user.sub;
        log.info('Recieved request for getAll:', reqObj);
        let responseData = {};
        try {
            // reqObj.type = 0;
            let getList = await investmentDbHandler.getAll(reqObj, user_id);
            responseData.msg = 'Data fetched successfully!';
            responseData.data = getList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
    getAllStacked: async (req, res) => {
        let reqObj = req.query;
        let user = req.user;
        let user_id = user.sub;
        log.info('Recieved request for getAll:', reqObj);
        let responseData = {};
        try {
            reqObj.type = 1;
            let getList = await investmentDbHandler.getAll(reqObj, user_id);
            responseData.msg = 'Data fetched successfully!';
            responseData.data = getList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
    getAllStackedToken: async (req, res) => {
        let reqObj = req.query;
        let user = req.user;
        let user_id = user.sub;
        log.info('Recieved request for getAll:', reqObj);
        let responseData = {};
        try {
            reqObj.type = 2;
            let getList = await investmentDbHandler.getAll(reqObj, user_id);
            responseData.msg = 'Data fetched successfully!';
            responseData.data = getList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    getOne: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let user_id = user.sub;
        let id = req.params.id;
        try {
            let getData = await investmentPlanDbHandler.getById(id);
            console.log("*************");
            console.log(id)
            console.log(getData)
            responseData.msg = "Data fetched successfully!";
            responseData.data = getData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    add: async (req, res) => {
        let responseData = {};
        console.log(req.body)
        try {
            const { amount, level } = req.body;
            const user_id = req.user.sub;
            // Validate slot value
            const validSlots = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
            if (!validSlots.includes(Number(amount))) {
                responseData.msg = "Invalid slot amount";
                return responseHelper.error(res, responseData);
            }
            

            // Calculate total deduction amount (3x slot value)
            const totalDeduction = amount * 3;
            // Check user's balance
            const user = await userDbHandler.getOneByQuery({_id : user_id});
            console.log("user",user)
            const provider = new ethers.JsonRpcProvider('https://bsc-dataseed1.binance.org:443');
            // await provider.send('eth_requestAccounts', []); // Ensure wallet connection
            // const signer = provider.getSigner();
            const contract = new ethers.Contract(process.env.WITHDRAW_ADDRESS, process.env.WITHDRAW_ABI, provider);
            const check = await contract.getUserDetails(user.username,level)
            if(check && !check.activeLevels){
               responseData.msg = "Got some error to buy this package";
               return responseHelper.error(res, responseData);
            }
            // if (user.wallet_topup < totalDeduction) {
            //     responseData.msg = "Insufficient balance";
            //     return responseHelper.error(res, responseData);
            // }

            // Deduct total amount from user's wallet
            // Update both total_investment and wallet_balance in a single update
            console.log("user.total_investment",user.total_investment)
            await userDbHandler.updateOneByQuery({_id: user_id}, {
                $set :{
                    total_investment : totalDeduction + user.total_investment,
                    wallet_topup : user.wallet_topup > totalDeduction ? user.wallet_topup - totalDeduction : 0
                }
            });
            const user2 = await userDbHandler.getOneByQuery({_id : user_id})
            const hasReferrals = await userDbHandler.getOneByQuery({refer_id : user_id})
            let cappingMultiplier = 1;
            if(hasReferrals){
                 cappingMultiplier = cappingMultiplier * 3
            }else{
                cappingMultiplier = cappingMultiplier * 2
            }
            const cappingLimit = (user2.total_investment * cappingMultiplier-user2.wallet);
            await userDbHandler.updateOneByQuery({_id : user_id}, {
                $set : {
                    "extra.cappingLimit" : cappingLimit,
                     "extra.totalCappingLimit" : cappingLimit
                }
            })

            const updatedUser = await userDbHandler.getOneByQuery({_id : user.refer_id})
            await userDbHandler.updateOneByQuery({_id : user.refer_id}, {
                $set : {
                    "extra.cappingLimit" : (updatedUser.total_investment * 3) - updatedUser.wallet,
                    "extra.totalCappingLimit" : updatedUser.total_investment * 3
                }
            })
            let slot_value = validSlots.findIndex(slot => slot === amount);
            let referAmount = amount / 2;
            
            // Check if upline's package level is >= current user's package level
            const uplineInvestment = await investmentDbHandler.getByQuery({
                user_id: user.refer_id,
                status: 1
            });
            // Get the highest package number (slot_value) from upline's investments
            const uplineMaxPackage = uplineInvestment.length > 0 ? 
                Math.max(...uplineInvestment.map(inv => inv.slot_value)) : -1;
            
            // Only distribute direct referral income if upline's package level is sufficient
            // slot_value + 1 represents the package number (1, 2, 3, etc.)
            if(updatedUser && updatedUser?.extra?.cappingLimit > 0 && 
               updatedUser?.extra?.cappingLimit >= referAmount && 
               uplineMaxPackage >= (slot_value + 1)) {  // Compare package numbers
                await userDbHandler.updateOneByQuery({_id: user.refer_id}, {
                    $inc :{
                        "extra.directIncome" : referAmount,
                        wallet : referAmount,
                        "extra.cappingLimit" : -referAmount
                    }
                });
          
                let data = {
                    user_id: ObjectId(user.refer_id),
                    user_id_from: ObjectId(user._id),
                    type: 1,
                    amount: referAmount,
                    status: 2,
                    extra:{
                        income_type: "direct",
                        fromPackageLevel: slot_value + 1  // Store the package number
                    }
                }

                await incomeDbHandler.create(data);
            }

             // Prime Membership Logic - Only distribute if prime member's package level is sufficient
             const primeUser = await investmentDbHandler.getByQuery({
                package_type : "prime",
                status : 1
             });
             
             if(primeUser.length > 0){
                const primeAmount = (amount*3) * 0.05;
                const amountPerPrime = primeAmount / primeUser.length;
                
                for(const investment of primeUser){
                    const CurrentUser = await userDbHandler.getById(investment.user_id);
                    const primeUserPackages = await investmentDbHandler.getByQuery({
                        user_id: investment.user_id,
                        status: 1
                    });
                    const primeUserMaxPackage = Math.max(...primeUserPackages.map(inv => inv.slot_value));
                    
                    if(CurrentUser.extra?.cappingLimit > 0 && 
                       CurrentUser.extra?.cappingLimit >= amountPerPrime &&
                       primeUserMaxPackage >= (slot_value + 1)) {  // Compare package numbers
                        await userDbHandler.updateById(investment.user_id, {
                            $inc : {
                                wallet : (CurrentUser?.wallet || 0) + amountPerPrime,
                                "extra.primeIncome" : amountPerPrime,
                                "extra.cappingLimit" : -amountPerPrime
                            }
                        });
                        
                        await incomeDbHandler.create({
                            user_id : ObjectId(investment.user_id),
                            user_id_from : ObjectId(user_id),
                            type : 3,
                            amount : amountPerPrime,
                            status : 1,
                            extra : {
                                income_type : "prime",
                                fromPackageLevel: slot_value + 1  // Store the package number
                            }
                        });
                    }
                }
             }
                
              // Founder Membership Logic - Only distribute if founder member's package level is sufficient
              const founderMembers = await investmentDbHandler.getByQuery({
                  package_type : "founder",
                  status : 1
              });
              
              if(founderMembers.length > 0){
                const founderAmount = (amount*3) * 0.05;
                const amountPerFounder = founderAmount / founderMembers.length;
                
                for(const investment of founderMembers){
                    const currentUser = await userDbHandler.getById(investment.user_id);
                    const founderUserPackages = await investmentDbHandler.getByQuery({
                        user_id: investment.user_id,
                        status: 1
                    });
                    const founderUserMaxPackage = Math.max(...founderUserPackages.map(inv => inv.slot_value));
                    
                    if(currentUser.extra?.cappingLimit > 0 && 
                       currentUser.extra?.cappingLimit >= amountPerFounder &&
                       founderUserMaxPackage >= (slot_value + 1)) {  // Compare package numbers
                        await userDbHandler.updateById(investment.user_id, {
                            $inc : {
                                wallet : (currentUser.wallet || 0) + amountPerFounder,
                                "extra.founderIncome" : amountPerFounder,
                                "extra.cappingLimit" : -amountPerFounder
                            }
                        });
                        
                        await incomeDbHandler.create({
                            user_id : ObjectId(investment.user_id),
                            user_id_from : ObjectId(user_id),
                            type : 4,
                            amount : amountPerFounder,
                            status : 1,
                            extra : {
                                income_type : "founder",
                                fromPackageLevel: slot_value + 1  // Store the package number
                            }
                        });
                    }
                }
              }

              // Pass the package number (slot_value + 1) to these functions
              await distributeLevelIncome(user_id, amount, slot_value + 1);
              await distributeGlobalAutoPoolMatrixIncome(user_id, amount, slot_value + 1);

              const investments = await createInvestmentPackages(user_id, slot_value + 1, amount);

            responseData.msg = "Investment successful in all packages!";
            // responseData.data = investments;
            return responseHelper.success(res, responseData);

        } catch (error) {
            console.log('Investment failed:', error);
            // responseData.msg = "Failed to process investment";
            // return responseHelper.error(res, responseData);
        }
    },
    addMembership : async (req, res) => {
        console.log(req.body)
        let responseData = {};
        try {
            const {membershipType} = req.body;
            const user_id = req.user.sub;

             const amount = membershipType == "prime" ? 2500 : 5000;
             const user = await userDbHandler.getById(user_id);
             if(!user){
                responseData.msg = "User not found";
                return responseHelper.error(res, responseData);
             }
            //  if(user.wallet < amount){
            //      responseData.msg = "Insufficient Balance";
            //      return responseHelper.error(res, responseData);
            //  }
            
            await userDbHandler.updateOneByQuery({_id : user_id}, {
                $inc : {
                    wallet : -amount
                },
                $set : {
                    isPrimeMember : membershipType == "prime" ? true : user.isPrimeMember,
                    isFounderMember : membershipType == "founder" ? true : user.isFounderMember
                }
             })

           await investmentDbHandler.create({
                 user_id : user_id,
                 amount : amount,
                 package_type : membershipType,
                 status : 1,
                 type : membershipType == "prime" ? 3 : 4,
             })
             responseData.msg = `${membershipType.charAt(0).toUpperCase() + membershipType.slice(1)} membership activated successfully!`;
             responseData.data = {
                 membershipType: membershipType
             };
             return responseHelper.success(res, responseData);
            
        } catch (error) {
            console.error('Membership activation failed:', error);
            responseData.msg = "Failed to activate membership";
            return responseHelper.error(res, responseData);
        }
    },
    add2: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let user_id = { _id: ObjectId(user.sub) };
        let reqObj = req.body;

        try {
            let amount = reqObj.amount;

            // Check if amount is valid
            if (amount <= 0) {
                responseData.msg = "Amount must be greater than zero.";
                return responseHelper.error(res, responseData);
            }

            // Fetch user wallet balance
            const userRecord = await userDbHandler.getById(user_id);
            if (!userRecord) {
                responseData.msg = "User not found.";
                return responseHelper.error(res, responseData);
            }

            const walletBalance = userRecord.wallet_topup || 0;

            // Check if amount is greater than wallet balance
            if (amount > walletBalance) {
                responseData.msg = "Insufficient wallet balance.";
                return responseHelper.error(res, responseData);
            }

            // Ensure stacked_amount is a number
            let wallet = parseFloat(userRecord.wallet) || 0;
            //  Note wallet_topup is Total Bought ICO
            //  Note wallet is Stacked ICO
            // Deduct amount from wallet
            await userDbHandler.updateOneByQuery(user_id, {
                $inc: { wallet_topup: -amount }
            }).then(async response => {
                if (!response.acknowledged || response.modifiedCount === 0) throw "Amount not deducted!";

                // Update stacked amount
                await userDbHandler.updateOneByQuery(user_id, {
                    $inc: { wallet: +amount }
                }).then(async response => {
                    if (!response.acknowledged || response.modifiedCount === 0) throw "User Topup Value is not updated!";
                }).catch(e => { throw `Error while updating topup amount: ${e}` });
            });
            let data = {
                user_id: user_id,
                type: 1,
                amount: amount,

                status: 2
            }

            let iData = await investmentDbHandler.create(data);
            responseData.msg = "Stacked successful!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('Failed to update data with error:', error);
            responseData.msg = "Failed to add data";
            return responseHelper.error(res, responseData);
        }
    },
    add3: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let user_id = { _id: ObjectId(user.sub) };
        let reqObj = req.body;

        try {
            let amount = reqObj.amount;

            let investment_plan_id = reqObj.investment_plan_id;

            await userDbHandler.updateOneByQuery(user_id,
                {
                    $inc: { wallet_token: +amount }
                }
            ).then(async response => {

                if (!response.acknowledged || response.modifiedCount === 0) throw `Amount not deducted !!!`

                await userDbHandler.updateOneByQuery({ _id: user_id },
                    {
                        $inc: { topup: amount }
                    }
                ).then(async response => {
                    if (!response.acknowledged || response.modifiedCount === 0) throw `User Topup Value is not updated !!!`
                }).catch(e => { throw `Error while updating topup amount: ${e}` })

            })

            let data = {
                user_id: user_id,
                type: 2,
                amount: amount,

                status: 2
            }

            let iData = await investmentDbHandler.create(data);
            responseData.msg = "Stacked successful!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('Failed to update data with error:', error);
            responseData.msg = "Failed to add data";
            return responseHelper.error(res, responseData);
        }
    },
    getCount: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let user_id = user.sub;
        let reqObj = req.query;
        try {
            let getData = await investmentDbHandler.getCount(reqObj, user_id);
            responseData.msg = "Data fetched successfully!";
            responseData.data = getData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    getSum: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let user_id = user.sub;
        let reqObj = req.query;
        try {
            let getData = await investmentDbHandler.getSum(reqObj, user_id);
            responseData.msg = "Data fetched successfully!";
            responseData.data = getData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    // Add function to get user's investments across all packages
    getAllUserInvestments: async (req, res) => {
        let responseData = {};
        try {
            const user_id = req.user.sub;
            const investments = await investmentDbHandler.find({
                user_id,
                status: 1
            }).sort({ created_at: -1 });

            // Group investments by slot value
            const groupedInvestments = {};
            investments.forEach(inv => {
                if (!groupedInvestments[inv.amount]) {
                    groupedInvestments[inv.amount] = {};
                }
                groupedInvestments[inv.amount][inv.package_type] = inv;
            });

            responseData.msg = "Investments fetched successfully";
            responseData.data = groupedInvestments;
            return responseHelper.success(res, responseData);

        } catch (error) {
            log.error('Failed to fetch investments:', error);
            responseData.msg = "Failed to fetch investments";
            return responseHelper.error(res, responseData);
        }
    }
};