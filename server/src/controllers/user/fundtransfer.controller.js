'use strict';
const logger = require('../../services/logger');
const log = new logger('FundTransferController').getChildLogger();
const { fundTransferDbHandler, userDbHandler } = require('../../services/db');
const { getWalletField } = require('../../services/commonFun');
const responseHelper = require('../../utils/customResponse');
const config = require('../../config/config');

module.exports = {

    getAll: async (req, res) => {
        let reqObj = req.query;
        let user = req.user;
        let user_id = user.sub;
        log.info('Recieved request for getAll:', reqObj);
        let responseData = {};
        try {
            let getList = await fundTransferDbHandler.getAll(reqObj, user_id);
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
            let getData = await fundTransferDbHandler.getById(id);
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
        let reqObj = req.body;

        try {
            const min = 10;
            const max = 100000000;
            const fee = reqObj.amount * 0;
            const net_amount = reqObj.amount - fee;

            const userFrom = await userDbHandler.getById(user_id);
            const userTo = await userDbHandler.getByQuery({ username: reqObj.user_id });

            if (!userTo) {
                responseData.msg = `Invalid User!`;
                return responseHelper.error(res, responseData);
            }

            if (userFrom.wallet_topup <= 0) {
                responseData.msg = `Please Buy ICO Package!`;
                return responseHelper.error(res, responseData);
            }

            if (userFrom.wallet_topup < reqObj.amount) {
                responseData.msg = `Insufficient ICO!`;
                return responseHelper.error(res, responseData);
            }

            if (reqObj.amount < min) {
                responseData.msg = `Minimum fund transfer ${min}!`;
                return responseHelper.error(res, responseData);
            }

            if (reqObj.amount > max) {
                responseData.msg = `Maximum fund transfer ${max}!`;
                return responseHelper.error(res, responseData);
            }

            if (reqObj.user_id === user_id) {
                responseData.msg = `Self Transfer Not available`;
                return responseHelper.error(res, responseData);
            }
            log.info(`Initiating fund transfer from user ${user_id} to ${reqObj.user_id} for amount ${reqObj.amount}`);

            // Update the sender's wallet
            await userDbHandler.updateOneByQuery({_id:user_id}, { $inc: { wallet_topup: -reqObj.amount } });

            // Update the recipient's wallet
            const updateResult = await userDbHandler.updateOneByQuery(
                { username: reqObj.user_id },
                { $inc: { wallet_topup: net_amount } }
            );

            if (updateResult.modifiedCount === 0) {
                log.warn(`No user found with username: ${reqObj.user_id}`);
                responseData.msg = `User not found or update failed!`;
                return responseHelper.error(res, responseData);
            }

            const data = {
                user_id: reqObj.user_id,
                user_id_from: user_id,
                amount: reqObj.amount,
                fee: fee,
                remark: reqObj.remark
            };


            await fundTransferDbHandler.create(data);
            responseData.msg = "Data added successfully!";
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
            let getData = await fundTransferDbHandler.getCount(reqObj, user_id);
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
            let getData = await fundTransferDbHandler.getSum(reqObj, user_id);
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