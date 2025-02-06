'use strict';
const logger = require('../../services/logger');
const log = new logger('InveatmentController').getChildLogger();
const { investmentDbHandler, investmentPlanDbHandler, userDbHandler, incomeDbHandler, settingDbHandler } = require('../../services/db');
const { getTopLevelByRefer } = require('../../services/commonFun');
const responseHelper = require('../../utils/customResponse');
const config = require('../../config/config');

const { userModel } = require('../../models');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { now } = require('mongoose')

module.exports = {

    getAll: async (req, res) => {
        let reqObj = req.query;
        let user = req.user;
        let user_id = user.sub;
        log.info('Recieved request for getAll:', reqObj);
        let responseData = {};
        try {
            reqObj.type = 0;
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
        let user = req.user;
        let user_id = user.sub;
        user_id = { _id: ObjectId(user_id) }
        let reqObj = req.body;
        try {
            let investment_plan_id = reqObj.investment_plan_id;
            let amount = reqObj.amount ;
        
            await userDbHandler.updateOneByQuery(user_id,
                {
                    $inc: { wallet_topup: +amount }
                }
            ).then(async response => {

                if (!response.acknowledged || response.modifiedCount === 0) throw `Amount not deducted !!!`

                await userDbHandler.updateOneByQuery({ _id: user_id },
                    {
                        $inc: { topup: amount },
                        $set: { "extra.package": investment_plan_id }
                    }
                ).then(async response => {
                    if (!response.acknowledged || response.modifiedCount === 0) throw `User Topup Value is not updated !!!`
                }).catch(e => { throw `Error while updating topup amount: ${e}` })

            })

           
            let data = {
                user_id: user_id,
                investment_plan_id: investment_plan_id,
                amount: amount,
          
                status: 1
            }

            let iData = await investmentDbHandler.create(data);

     

            responseData.msg = "Investment successful!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to update data with error::', error);
            responseData.msg = "Failed to add data";
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
                type:1,
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
    }
};