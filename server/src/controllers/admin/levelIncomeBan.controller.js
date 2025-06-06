'use strict';

const logger = require('../../services/logger');
const log = new logger('AdminLevelIncomeBanController').getChildLogger();
const { userDbHandler, incomeDbHandler } = require('../../services/db');
const responseHelper = require('../../utils/customResponse');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/**
 * Get all users with their level income ban status
 */
const getAllUsersWithBanStatus = async (req, res) => {
    try {
        const { page = 1, limit = 50, search = '', banStatus = 'all' } = req.query;
        const skip = (page - 1) * limit;

        // Build search query
        let searchQuery = { status: true }; // Only active users
        
        if (search) {
            searchQuery.$or = [
                { username: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by ban status
        if (banStatus === 'banned') {
            searchQuery['extra.levelIncomeBanned'] = true;
        } else if (banStatus === 'active') {
            searchQuery['extra.levelIncomeBanned'] = { $ne: true };
        }

        const users = await userDbHandler.getByQuery(
            searchQuery,
            { 
                password: 0, 
                access_token: 0, 
                two_fa_secret: 0 
            },
            { 
                skip: parseInt(skip), 
                limit: parseInt(limit),
                sort: { created_at: -1 }
            }
        );

        const totalUsers = await userDbHandler.countByQuery(searchQuery);

        // Format response with ban status
        const formattedUsers = users.map(user => ({
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            reward: user.reward || 0,
            levelIncome: user.extra?.levelIncome || 0,
            totalIncome: user.extra?.totalIncome || 0,
            levelIncomeBanned: user.extra?.levelIncomeBanned === true,
            bannedAt: user.extra?.levelIncomeBannedAt || null,
            bannedBy: user.extra?.levelIncomeBannedBy || null,
            created_at: user.created_at
        }));

        const responseData = {
            users: formattedUsers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers,
                hasNext: page * limit < totalUsers,
                hasPrev: page > 1
            }
        };

        return responseHelper.success(res, responseData, "Users retrieved successfully");

    } catch (error) {
        log.error('Error getting users with ban status:', error.message);
        return responseHelper.error(res, { message: "Failed to retrieve users" });
    }
};

/**
 * Ban user from level income distribution by username
 */
const banUserByUsername = async (req, res) => {
    try {
        const { username, reason = "Banned by admin" } = req.body;
        const adminId = req.admin.sub; // Get admin ID from token

        if (!username) {
            return responseHelper.error(res, { message: "Username is required" });
        }

        // Find user by username
        const user = await userDbHandler.getOneByQuery({ username: username.trim() });
        if (!user) {
            return responseHelper.error(res, { message: `User "${username}" not found` });
        }

        // Check if user is already banned
        if (user.extra?.levelIncomeBanned === true) {
            return responseHelper.error(res, { message: `User "${username}" is already banned from level income` });
        }

        // Update user with ban status
        await userDbHandler.updateOneByQuery(
            { _id: ObjectId(user._id) },
            {
                $set: {
                    "extra.levelIncomeBanned": true,
                    "extra.levelIncomeBannedAt": new Date(),
                    "extra.levelIncomeBannedBy": adminId,
                    "extra.levelIncomeBanReason": reason
                }
            }
        );

        // Create income record for tracking
        await incomeDbHandler.create({
            user_id: ObjectId(user._id),
            amount: 0,
            type: 2, // Level income type
            status: 2, // Banned status
            remarks: `Level income banned by admin - Reason: ${reason}`,
            extra: {
                action: "banned",
                bannedBy: adminId,
                bannedAt: new Date(),
                reason: reason
            }
        });

        log.info(`User ${user.username} banned from level income by admin ${adminId}`);

        return responseHelper.success(res, {
            userId: user._id,
            username: user.username,
            bannedAt: new Date(),
            reason: reason
        }, `User "${username}" successfully banned from level income distribution`);

    } catch (error) {
        log.error('Error banning user from level income by username:', error.message);
        return responseHelper.error(res, { message: "Failed to ban user from level income" });
    }
};

/**
 * Ban user from level income distribution by userId
 */
const banUserFromLevelIncome = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason = "Banned by admin" } = req.body;
        const adminId = req.admin.sub; // Get admin ID from token

        // Validate user exists
        const user = await userDbHandler.getById(userId);
        if (!user) {
            return responseHelper.error(res, { message: "User not found" });
        }

        // Check if user is already banned
        if (user.extra?.levelIncomeBanned === true) {
            return responseHelper.error(res, { message: "User is already banned from level income" });
        }

        // Update user with ban status
        await userDbHandler.updateOneByQuery(
            { _id: ObjectId(userId) },
            {
                $set: {
                    "extra.levelIncomeBanned": true,
                    "extra.levelIncomeBannedAt": new Date(),
                    "extra.levelIncomeBannedBy": adminId,
                    "extra.levelIncomeBanReason": reason
                }
            }
        );

        // Create income record for tracking
        await incomeDbHandler.create({
            user_id: ObjectId(userId),
            amount: 0,
            type: 2, // Level income type
            status: 2, // Banned status
            remarks: `Level income banned by admin - Reason: ${reason}`,
            extra: {
                action: "banned",
                bannedBy: adminId,
                bannedAt: new Date(),
                reason: reason
            }
        });

        log.info(`User ${user.username} banned from level income by admin ${adminId}`);

        return responseHelper.success(res, {
            userId: userId,
            username: user.username,
            bannedAt: new Date(),
            reason: reason
        }, "User successfully banned from level income distribution");

    } catch (error) {
        log.error('Error banning user from level income:', error.message);
        return responseHelper.error(res, { message: "Failed to ban user from level income" });
    }
};

/**
 * Unban user from level income distribution by username
 */
const unbanUserByUsername = async (req, res) => {
    try {
        const { username, reason = "Unbanned by admin" } = req.body;
        const adminId = req.admin.sub; // Get admin ID from token

        if (!username) {
            return responseHelper.error(res, { message: "Username is required" });
        }

        // Find user by username
        const user = await userDbHandler.getOneByQuery({ username: username.trim() });
        if (!user) {
            return responseHelper.error(res, { message: `User "${username}" not found` });
        }

        // Check if user is actually banned
        if (user.extra?.levelIncomeBanned !== true) {
            return responseHelper.error(res, { message: `User "${username}" is not banned from level income` });
        }

        // Update user to remove ban
        await userDbHandler.updateOneByQuery(
            { _id: ObjectId(user._id) },
            {
                $set: {
                    "extra.levelIncomeBanned": false,
                    "extra.levelIncomeUnbannedAt": new Date(),
                    "extra.levelIncomeUnbannedBy": adminId,
                    "extra.levelIncomeUnbanReason": reason
                }
            }
        );

        // Create income record for tracking
        await incomeDbHandler.create({
            user_id: ObjectId(user._id),
            amount: 0,
            type: 2, // Level income type
            status: 1, // Active status
            remarks: `Level income unbanned by admin - Reason: ${reason}`,
            extra: {
                action: "unbanned",
                unbannedBy: adminId,
                unbannedAt: new Date(),
                reason: reason
            }
        });

        log.info(`User ${user.username} unbanned from level income by admin ${adminId}`);

        return responseHelper.success(res, {
            userId: user._id,
            username: user.username,
            unbannedAt: new Date(),
            reason: reason
        }, `User "${username}" successfully unbanned from level income distribution`);

    } catch (error) {
        log.error('Error unbanning user from level income by username:', error.message);
        return responseHelper.error(res, { message: "Failed to unban user from level income" });
    }
};

/**
 * Unban user from level income distribution by userId
 */
const unbanUserFromLevelIncome = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason = "Unbanned by admin" } = req.body;
        const adminId = req.admin.sub; // Get admin ID from token

        // Validate user exists
        const user = await userDbHandler.getById(userId);
        if (!user) {
            return responseHelper.error(res, { message: "User not found" });
        }

        // Check if user is actually banned
        if (user.extra?.levelIncomeBanned !== true) {
            return responseHelper.error(res, { message: "User is not banned from level income" });
        }

        // Update user to remove ban
        await userDbHandler.updateOneByQuery(
            { _id: ObjectId(userId) },
            {
                $set: {
                    "extra.levelIncomeBanned": false,
                    "extra.levelIncomeUnbannedAt": new Date(),
                    "extra.levelIncomeUnbannedBy": adminId,
                    "extra.levelIncomeUnbanReason": reason
                }
            }
        );

        // Create income record for tracking
        await incomeDbHandler.create({
            user_id: ObjectId(userId),
            amount: 0,
            type: 2, // Level income type
            status: 1, // Active status
            remarks: `Level income unbanned by admin - Reason: ${reason}`,
            extra: {
                action: "unbanned",
                unbannedBy: adminId,
                unbannedAt: new Date(),
                reason: reason
            }
        });

        log.info(`User ${user.username} unbanned from level income by admin ${adminId}`);

        return responseHelper.success(res, {
            userId: userId,
            username: user.username,
            unbannedAt: new Date(),
            reason: reason
        }, "User successfully unbanned from level income distribution");

    } catch (error) {
        log.error('Error unbanning user from level income:', error.message);
        return responseHelper.error(res, { message: "Failed to unban user from level income" });
    }
};

/**
 * Get level income ban history for a user
 */
const getUserBanHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate user exists
        const user = await userDbHandler.getById(userId);
        if (!user) {
            return responseHelper.error(res, { message: "User not found" });
        }

        // Get ban/unban history from income records
        const banHistory = await incomeDbHandler.getByQuery(
            {
                user_id: ObjectId(userId),
                type: 2,
                $or: [
                    { "extra.action": "banned" },
                    { "extra.action": "unbanned" }
                ]
            },
            {},
            { sort: { created_at: -1 } }
        );

        const responseData = {
            userId: userId,
            username: user.username,
            currentStatus: {
                isBanned: user.extra?.levelIncomeBanned === true,
                bannedAt: user.extra?.levelIncomeBannedAt || null,
                bannedBy: user.extra?.levelIncomeBannedBy || null,
                reason: user.extra?.levelIncomeBanReason || null
            },
            history: banHistory.map(record => ({
                action: record.extra?.action,
                date: record.created_at,
                adminId: record.extra?.bannedBy || record.extra?.unbannedBy,
                reason: record.extra?.reason,
                remarks: record.remarks
            }))
        };

        return responseHelper.success(res, responseData, "Ban history retrieved successfully");

    } catch (error) {
        log.error('Error getting user ban history:', error.message);
        return responseHelper.error(res, { message: "Failed to retrieve ban history" });
    }
};

/**
 * Get level income distribution statistics
 */
const getLevelIncomeStats = async (req, res) => {
    try {
        // Get total users
        const totalUsers = await userDbHandler.countByQuery({ status: true });
        
        // Get banned users count
        const bannedUsers = await userDbHandler.countByQuery({ 
            status: true,
            'extra.levelIncomeBanned': true 
        });

        // Get recent level income distributions (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentDistributions = await incomeDbHandler.getByQuery(
            {
                type: 2,
                status: 1,
                created_at: { $gte: thirtyDaysAgo }
            }
        );

        const totalDistributed = recentDistributions.reduce((sum, income) => sum + income.amount, 0);

        // Get blocked distributions (banned users)
        const blockedDistributions = await incomeDbHandler.getByQuery(
            {
                type: 2,
                status: 2,
                created_at: { $gte: thirtyDaysAgo }
            }
        );

        const responseData = {
            totalUsers,
            bannedUsers,
            activeUsers: totalUsers - bannedUsers,
            banPercentage: totalUsers > 0 ? ((bannedUsers / totalUsers) * 100).toFixed(2) : 0,
            last30Days: {
                totalDistributions: recentDistributions.length,
                totalAmountDistributed: totalDistributed,
                blockedDistributions: blockedDistributions.length,
                averagePerDistribution: recentDistributions.length > 0 ? (totalDistributed / recentDistributions.length).toFixed(2) : 0
            }
        };

        return responseHelper.success(res, responseData, "Level income statistics retrieved successfully");

    } catch (error) {
        log.error('Error getting level income stats:', error.message);
        return responseHelper.error(res, { message: "Failed to retrieve statistics" });
    }
};

module.exports = {
    getAllUsersWithBanStatus,
    banUserByUsername,
    unbanUserByUsername,
    banUserFromLevelIncome,
    unbanUserFromLevelIncome,
    getUserBanHistory,
    getLevelIncomeStats
};
