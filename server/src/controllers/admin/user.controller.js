'use strict';
const logger = require('../../services/logger');
const log = new logger('AdminUsersController').getChildLogger();
const { userDbHandler, verificationDbHandler, messageDbHandler, socialLinksDbHandler } = require('../../services/db');
const { getChildLevelsByRefer } = require('../../services/commonFun');
const bcrypt = require('bcryptjs');
const responseHelper = require('../../utils/customResponse');
const config = require('../../config/config');
const jwtService = require('../../services/jwt');
const templates = require('../../utils/templates/template');
const emailService = require('../../services/sendEmail');
const mongoose = require('mongoose');
const investmentDbHandler = require('../../services/db').investmentDbHandler;

/*******************
 * PRIVATE FUNCTIONS
 ********************/

let _encryptPassword = (password) => {
    let salt = config.bcrypt.saltValue;
    // generate a salt
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(salt, function (err, salt) {
            if (err) reject(err);
            // hash the password with new salt
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) reject(err);
                // override the plain password with the hashed one
                resolve(hash);
            });
        });
    });
};
/**
 * Method to generate jwt token
 */
let _generateVerificationToken = (tokenData, verification_type) => {
    //create a new instance for jwt service
    let tokenService = new jwtService();
    let token = tokenService.createJwtVerificationToken(tokenData, verification_type);
    return token;
};

/*******************
* PRIVATE FUNCTIONS
********************/
/**
* Method to Compare password
*/
let _comparePassword = (reqPassword, userPassword) => {
    return new Promise((resolve, reject) => {
        //compare password with bcrypt method, password and hashed password both are required
        bcrypt.compare(reqPassword, userPassword, function (err, isMatch) {
            if (err) reject(err);
            resolve(isMatch);
        });
    });
};

// Method to create hash password on update
let _createHashPassword = async (password) => {
    let salt = config.bcrypt.saltValue;
    const saltpass = await bcrypt.genSalt(salt);
    // now we set user password to hashed password
    let hashedPassword = await bcrypt.hash(password, saltpass);
    return hashedPassword;
}

/**************************
 * END OF PRIVATE FUNCTIONS
 **************************/
module.exports = {

    getAll: async (req, res) => {
        let reqObj = req.query;
        log.info('Recieved request for getAll Users:', reqObj);
        console.log(reqObj)
        let responseData = {};
        try {
            let getList;
            if (reqObj?.limit == -1) {
                getList = await userDbHandler.getByQuery({}, { 'username': 1, 'name': 1, 'email': 1, 'status': 1 });
            }
            else {
                getList = await userDbHandler.getAll(reqObj);
            }

            responseData.msg = 'Data fetched successfully!';
            responseData.data = getList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch users data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
    get_daily_task_data: async (req, res) => {
        let reqObj = req.query;
        log.info('Recieved request for getAll Users:', reqObj);
        console.log("aya%%%%%%%%%%%%%%")
        console.log(reqObj)
        let responseData = {};
        try {

            let getList;
            if (reqObj?.limit == -1) {
                getList = await socialLinksDbHandler.getByQuery({'user_id':1}, { 'user_id': 1, 'url': 1});
                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^")
            }
            else {
                getList = await socialLinksDbHandler.getAll(reqObj);
                console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
                console.log(getList)

            }

            responseData.msg = 'Data fetched successfully!';
            responseData.data = getList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to get all users data with error::', error);
            responseData.msg = 'Failed to get Data';
            return responseHelper.error(res, responseData);
        }

    },
    get_daily_task_data2: async (req, res) => {
        let reqObj = req.query;
        log.info('Recieved request for getAll Users:', reqObj);
        console.log("aya%%%%%%%%%%%%%%")
        console.log(reqObj)
        let responseData = {};
        try {

            let getList;
                getList = await socialLinksDbHandler.getAllWithoutLimit(reqObj);
                console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
                console.log(getList)


            responseData.msg = 'Data fetched successfully!';
            responseData.data = getList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to get all users data with error::', error);
            responseData.msg = 'Failed to get Data';
            return responseHelper.error(res, responseData);
        }

    },

    getDownline: async (req, res) => {
        let reqObj = req.query;
        log.info('Recieved request for getDownline Users:', reqObj);
        let responseData = {};
        try {
            let getList = await getChildLevelsByRefer(null, true, 20);
            responseData.msg = 'Data fetched successfully!';
            responseData.data = getList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch users data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    getCount: async (req, res) => {
        let responseData = {};
        let status = null;
        if (req?.query?.status !== null) {
            status = req?.query?.status ? true : false;
        }
        try {
            let getData = await messageDbHandler.getCount(null, status);
            responseData.msg = "Data fetched successfully!";
            responseData.data = getData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    getOne: async (req, res) => {
        let userId = req.params.id;
        let responseData = {};
        try {
            let getDetail = await userDbHandler.getById(userId, { password: 0 });
            responseData.msg = "Data fetched successfully!";
            responseData.data = getDetail;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    getOneBYUsername: async (req, res) => {
        let username = req.params.username;
        let responseData = {};
        try {
            let getDetail = await userDbHandler.getOneByQuery({ username: username }, { password: 0 });
            responseData.msg = "Data fetched successfully!";
            responseData.data = getDetail;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    update: async (req, res) => {
        let reqObj = req.body;
        log.info('Recieved request for Admin User update:', reqObj);
        let responseData = {};
        try {
            let query = { _id: { $ne: reqObj.id } };
            if (config.loginByType == 'email') {
                query.username = reqObj?.email.toLowerCase();
            }
            else if (config.loginByType == 'address') {
                query.username = reqObj?.address.toLowerCase();
            }
            else {
                query.username = reqObj?.username;
            }
            let checkUsername = await userDbHandler.getByQuery(query);
            let checkEmail = await userDbHandler.getByQuery({ _id: { $ne: reqObj.id }, email: reqObj?.email });
            let checkPhoneNumber = await userDbHandler.getByQuery({ _id: { $ne: reqObj.id }, phone_number: reqObj?.phone_number });

            if (checkUsername.length) {
                responseData.msg = `${config.loginByName} Already Exist !`;
                return responseHelper.error(res, responseData);
            }
            if (reqObj?.email && checkEmail.length >= config.emailCheck) {
                responseData.msg = 'Email Already Exist !';
                return responseHelper.error(res, responseData);
            }
            if (reqObj?.phone_number && checkPhoneNumber.length >= config.phoneCheck) {
                responseData.msg = 'Phone Number Already Exist !';
                return responseHelper.error(res, responseData);
            }
            if (reqObj?.email) {
                reqObj.email = reqObj.email.toLowerCase();
            }
            let userData = await userDbHandler.getById(reqObj.id, { password: 0 });
            if (!userData) {
                responseData.msg = 'Invalid user!';
                return responseHelper.error(res, responseData);
            }

            let updatedObj = {
                name: reqObj.name,
                phone_number: reqObj?.phone_number,
            }

            if (reqObj.email != undefined && reqObj.email) {
                updatedObj.email = reqObj?.email
            }

            if (reqObj.username != undefined && reqObj.username) {
                updatedObj.username = reqObj?.username
            }

            if (reqObj.address != undefined && reqObj.address) {
                updatedObj.address = reqObj?.address
            }

            if (reqObj.reward != undefined && reqObj.reward) {
                updatedObj.reward = reqObj?.reward
            }

            if (reqObj.extra != undefined && reqObj.extra) {
                updatedObj.extra = reqObj?.extra
            }

            if (reqObj.status !== undefined) {
                updatedObj.status = reqObj.status;
            }

            if (reqObj.password) {
                updatedObj.password = await _createHashPassword(reqObj.password);
            }

            await userDbHandler.updateById(reqObj.id, updatedObj);
            responseData.msg = `Data updated sucessfully !`;
            return responseHelper.success(res, responseData);

        } catch (error) {
            log.error('failed to update user with error::', error);
            responseData.msg = 'Failed to update user';
            return responseHelper.error(res, responseData);
        }
    },

    banDownline: async (req, res) => {
        try {
            const userId = req.params.id;
            
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            // Get all users in the downline
            const levels = await getChildLevelsByRefer(userId, false);
            
            // Flatten the array of levels into a single array of users
            let allUsers = [];
            for (let i = 1; i < levels.length; i++) {
                // Extract user IDs from each level
                const userIds = levels[i].map(user => user._id);
                allUsers = [...allUsers, ...userIds];
            }
            allUsers = [...allUsers, ...userId];
            if (allUsers.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: 'No users found in downline',
                    data: {
                        bannedCount: 0,
                        failedCount: 0
                    }
                });
            }

            // Ban all users in the downline
            let bannedCount = 0;
            let failedCount = 0;

            for (const userId of allUsers) {
                try {
                    const result = await investmentDbHandler.updateByQuery(
                        { user_id: mongoose.Types.ObjectId(userId) },
                        { status: 1 }
                    );
                    if (result) {
                        bannedCount++;
                    } else {
                        failedCount++;
                    }
                } catch (error) {
                    console.error(`Error banning user ${userId}:`, error);
                    failedCount++;
                }
            }

            return res.status(200).json({
                success: true,
                message: 'Downline users banned successfully',
                data: {
                    bannedCount,
                    failedCount
                }
            });

        } catch (error) {
            console.error('Error in banDownline:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    unbanDownline: async (req, res) => {
        try {
            const userId = req.params.id;
            
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            // Get all users in the downline
            const levels = await getChildLevelsByRefer(userId, false);
            
            // Flatten the array of levels into a single array of users
            let allUsers = [];
            for (let i = 1; i < levels.length; i++) {
                // Extract user IDs from each level
                const userIds = levels[i].map(user => user._id);
                allUsers = [...allUsers, ...userIds];
            }

            if (allUsers.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: 'No users found in downline',
                    data: {
                        bannedCount: 0,
                        failedCount: 0
                    }
                });
            }

            // Unban all users in the downline
            let bannedCount = 0;
            let failedCount = 0;

            for (const userId of allUsers) {
                try {
                    const result = await investmentDbHandler.updateByQuery(
                        { user_id: mongoose.Types.ObjectId(userId) },
                        { status: 2 }
                    );
                    if (result) {
                        bannedCount++;
                    } else {
                        failedCount++;
                    }
                } catch (error) {
                    console.error(`Error unbanning user ${userId}:`, error);
                    failedCount++;
                }
            }

            return res.status(200).json({
                success: true,
                message: 'Downline users unbanned successfully',
                data: {
                    bannedCount,
                    failedCount
                }
            });

        } catch (error) {
            console.error('Error in unbanDownline:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    add: async (req, res) => {
        let reqObj = req.body;
        log.info('Received request for Admin User Creation:', reqObj);
        let responseData = {};

        try {
            // Check if username already exists
            let checkUsername = await userDbHandler.getByQuery({ username: reqObj.username });
            if (checkUsername.length) {
                responseData.msg = 'Username already exists!';
                return responseHelper.error(res, responseData);
            }

            // Check if email already exists (if provided)
            if (reqObj.email) {
                let checkEmail = await userDbHandler.getByQuery({ email: reqObj.email.toLowerCase() });
                if (checkEmail.length) {
                    responseData.msg = 'Email already exists!';
                    return responseHelper.error(res, responseData);
                }
            }

            // Check if phone number already exists (if provided)
            if (reqObj.phone_number) {
                let checkPhoneNumber = await userDbHandler.getByQuery({ phone_number: reqObj.phone_number });
                if (checkPhoneNumber.length) {
                    responseData.msg = 'Phone number already exists!';
                    return responseHelper.error(res, responseData);
                }
            }

            let refer_id = null;
            let trace_id = '';

            // If referrer username is provided, validate it
            if (reqObj.refer_username) {
                let referUser = await userDbHandler.getOneByQuery({ username: reqObj.refer_username }, { _id: 1, username: 1 });
                if (referUser) {
                    refer_id = referUser._id;
                    trace_id = reqObj.refer_username;
                } else {
                    responseData.msg = `No referrer exists with username: ${reqObj.refer_username}`;
                    return responseHelper.error(res, responseData);
                }
            }

            // Hash the password
            let hashedPassword = await _encryptPassword(reqObj.password);

            // Prepare user data
            let submitData = {
                refer_id: refer_id,
                trace_id: trace_id,
                username: reqObj.username,
                email: reqObj.email ? reqObj.email.toLowerCase() : '',
                password: hashedPassword,
                name: reqObj.name,
                phone_number: reqObj.phone_number || '',
                wallet: reqObj.wallet || 0,
                status: reqObj.status !== undefined ? reqObj.status : true
            };

            // Create the user
            let newUser = await userDbHandler.create(submitData);
            log.info('User created by admin:', newUser);

            responseData.msg = 'User created successfully!';
            responseData.data = {
                _id: newUser._id,
                username: newUser.username,
                name: newUser.name,
                email: newUser.email,
                phone_number: newUser.phone_number,
                wallet: newUser.wallet,
                status: newUser.status
            };
            return responseHelper.success(res, responseData);

        } catch (error) {
            log.error('Failed to create user with error::', error);
            responseData.msg = 'Failed to create user';
            return responseHelper.error(res, responseData);
        }
    },

    checkUsername: async (req, res) => {
        let username = req.params.username;
        log.info('Received request to check username:', username);
        let responseData = {};

        try {
            if (!username) {
                responseData.msg = 'Username is required';
                return responseHelper.error(res, responseData);
            }

            // Check if username exists
            let user = await userDbHandler.getOneByQuery({ username: username }, { _id: 1, username: 1, name: 1 });

            if (user) {
                responseData.msg = 'Username exists';
                responseData.data = {
                    exists: true,
                    user: {
                        _id: user._id,
                        username: user.username,
                        name: user.name
                    }
                };
                return responseHelper.success(res, responseData);
            } else {
                responseData.msg = 'Username does not exist';
                responseData.data = {
                    exists: false
                };
                return responseHelper.success(res, responseData);
            }

        } catch (error) {
            log.error('Failed to check username with error::', error);
            responseData.msg = 'Failed to check username';
            return responseHelper.error(res, responseData);
        }
    },

};