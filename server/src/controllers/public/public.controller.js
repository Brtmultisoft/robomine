'use strict';
const logger = require('../../services/logger');
const log = new logger('IncomeController').getChildLogger();
const { incomeDbHandler, userDbHandler, investmentDbHandler, investmentPlanDbHandler, settingDbHandler, depositDbHandler, withdrawalDbHandler } = require('../../services/db');
const { getChildLevelsByRefer, getTopLevelByRefer, getChildLevels, getSingleDimensional } = require('../../services/commonFun');
const responseHelper = require('../../utils/customResponse');
const config = require('../../config/config');
const { userModel } = require('../../models');

const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId



module.exports = {
    // Get RBM Whitelist status for a specific address
    getRBMWhitelistStatus: async (req, res) => {
        try {
            const { address } = req.params;

            if (!address) {
                return responseHelper.error(res, { msg: 'Address is required' });
            }

            // Validate address format
            const addressRegex = /^0x[a-fA-F0-9]{40}$/;
            if (!addressRegex.test(address)) {
                return responseHelper.error(res, { msg: 'Invalid address format' });
            }

            // Mock response - In real implementation, this would query blockchain
            const mockStatus = {
                address: address,
                isRegistered: Math.random() > 0.5, // Random for demo
                allowance: (Math.random() * 1000).toFixed(4),
                balance: (Math.random() * 500).toFixed(4),
                canTransfer: Math.random() > 0.3,
                lastUpdated: new Date().toISOString()
            };

            return responseHelper.success(res, mockStatus);
        } catch (error) {
            log.error('Error getting RBM whitelist status:', error);
            return responseHelper.error(res, { msg: 'Internal server error' });
        }
    },

    // Register address to RBM Whitelist
    registerRBMWhitelist: async (req, res) => {
        try {
            const { address, signature } = req.body;

            if (!address) {
                return responseHelper.error(res, { msg: 'Address is required' });
            }

            // Validate address format
            const addressRegex = /^0x[a-fA-F0-9]{40}$/;
            if (!addressRegex.test(address)) {
                return responseHelper.error(res, { msg: 'Invalid address format' });
            }

            // Mock registration - In real implementation, this would interact with smart contract
            const registrationResult = {
                success: true,
                address: address,
                transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
                blockNumber: Math.floor(Math.random() * 1000000),
                timestamp: new Date().toISOString()
            };

            return responseHelper.success(res, registrationResult);
        } catch (error) {
            log.error('Error registering RBM whitelist:', error);
            return responseHelper.error(res, { msg: 'Internal server error' });
        }
    },

    // Get RBM Whitelist statistics
    getRBMWhitelistStats: async (req, res) => {
        try {
            // Mock statistics - In real implementation, this would query blockchain/database
            const stats = {
                totalRegistered: Math.floor(Math.random() * 10000),
                totalAllowance: (Math.random() * 1000000).toFixed(2),
                totalBalance: (Math.random() * 500000).toFixed(2),
                activeTransfers: Math.floor(Math.random() * 100),
                contractAddress: '0xFd58b061Ab492A1EE874D581E1Ac88a075af56d3',
                network: 'BSC',
                lastUpdated: new Date().toISOString()
            };

            return responseHelper.success(res, stats);
        } catch (error) {
            log.error('Error getting RBM whitelist stats:', error);
            return responseHelper.error(res, { msg: 'Internal server error' });
        }
    },

    // Get list of RBM Whitelist users
    getRBMWhitelistUsers: async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;

            // Mock user list - In real implementation, this would query blockchain/database
            const users = [];
            for (let i = 0; i < limit; i++) {
                users.push({
                    address: '0x' + Math.random().toString(16).substr(2, 40),
                    isRegistered: Math.random() > 0.3,
                    allowance: (Math.random() * 1000).toFixed(4),
                    balance: (Math.random() * 500).toFixed(4),
                    canTransfer: Math.random() > 0.4,
                    registeredAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
                });
            }

            const response = {
                users: users,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: Math.floor(Math.random() * 10000),
                    pages: Math.ceil(Math.random() * 1000)
                }
            };

            return responseHelper.success(res, response);
        } catch (error) {
            log.error('Error getting RBM whitelist users:', error);
            return responseHelper.error(res, { msg: 'Internal server error' });
        }
    }
}
