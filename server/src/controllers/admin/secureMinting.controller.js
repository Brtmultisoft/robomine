'use strict';

const logger = require('../../services/logger');
const log = new logger('SecureMintingController').getChildLogger();
const { userDbHandler, incomeDbHandler } = require('../../services/db');
const responseHelper = require('../../utils/customResponse');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const config = require('../../config/config');

/**
 * Prepare minting data for admin approval (no private keys involved)
 */
const prepareMinting = async (req, res) => {
    try {
        log.info('=== PREPARING SECURE MINTING DATA ===');

        // Get users with reward balance, excluding admin wallets
        const allUsers = await userDbHandler.getByQuery({ reward: { $gt: 0 } });

        if (!allUsers || allUsers.length === 0) {
            return responseHelper.success(res, {
                totalUsers: 0,
                totalAmount: 0,
                batches: [],
                totalTransactions: 0,
                message: "No users eligible for minting"
            }, "No users eligible for minting");
        }

        // Filter out admin wallet addresses
        const users = allUsers.filter(user => {
            const isAdminWallet = config.adminWallets.includes(user.username);
            if (isAdminWallet) {
                log.info(`Excluding admin wallet: ${user.username} (reward: ${user.reward})`);
            }
            return !isAdminWallet;
        });

        if (users.length === 0) {
            return responseHelper.success(res, {
                totalUsers: 0,
                totalAmount: 0,
                batches: [],
                totalTransactions: 0,
                message: "No eligible users for minting (all users are admin wallets)"
            }, "No eligible users for minting");
        }

        // Process users with large balances by splitting them into smaller batches
        const MAX_TRANSACTION_AMOUNT = 4500; // Maximum amount per transaction
        const BATCH_SIZE = 10; // Maximum number of users per batch

        const mintingTransactions = [];
        let totalAmount = 0;

        // Prepare transactions for each user
        for (const user of users) {
            const username = user.username;
            const totalReward = parseFloat(parseFloat(user.reward).toFixed(6));

            // Skip users with invalid usernames or zero/negative rewards
            if (!username || totalReward <= 0) {
                log.warn(`Skipping user with invalid data: ID=${user._id}, username=${username}, reward=${totalReward}`);
                continue;
            }

            // If user's reward is less than or equal to the max amount, add as a single transaction
            if (totalReward <= MAX_TRANSACTION_AMOUNT) {
                mintingTransactions.push({
                    userId: user._id,
                    username,
                    amount: totalReward,
                    isPartial: false,
                    totalAmount: totalReward
                });
                totalAmount += totalReward;
            } else {
                // Split large balances into multiple transactions
                const fullBatches = Math.floor(totalReward / MAX_TRANSACTION_AMOUNT);
                const remainder = parseFloat((totalReward - (fullBatches * MAX_TRANSACTION_AMOUNT)).toFixed(6));

                // Add full-sized batches
                for (let i = 0; i < fullBatches; i++) {
                    mintingTransactions.push({
                        userId: user._id,
                        username,
                        amount: MAX_TRANSACTION_AMOUNT,
                        isPartial: true,
                        totalAmount: totalReward,
                        batchNumber: i + 1,
                        totalBatches: fullBatches + (remainder > 0 ? 1 : 0)
                    });
                    totalAmount += MAX_TRANSACTION_AMOUNT;
                }

                // Add remainder batch if needed
                if (remainder > 0) {
                    mintingTransactions.push({
                        userId: user._id,
                        username,
                        amount: remainder,
                        isPartial: true,
                        totalAmount: totalReward,
                        batchNumber: fullBatches + 1,
                        totalBatches: fullBatches + 1
                    });
                    totalAmount += remainder;
                }
            }
        }

        // Group transactions into batches for blockchain execution
        const batches = [];
        for (let i = 0; i < mintingTransactions.length; i += BATCH_SIZE) {
            const batch = mintingTransactions.slice(i, i + BATCH_SIZE);
            batches.push(batch);
        }

        const responseData = {
            totalUsers: users.length,
            totalAmount: parseFloat(totalAmount.toFixed(6)),
            batches: batches,
            totalTransactions: mintingTransactions.length,
            maxTransactionAmount: MAX_TRANSACTION_AMOUNT,
            batchSize: BATCH_SIZE,
            preparedAt: new Date().toISOString()
        };

        log.info(`Minting data prepared: ${users.length} users, ${mintingTransactions.length} transactions, ${batches.length} batches`);

        return responseHelper.success(res, {
            msg: "Minting data prepared successfully",
            data: responseData
        });

    } catch (error) {
        log.error('Error preparing minting data:', error.message);
        return responseHelper.error(res, { message: "Failed to prepare minting data" });
    }
};

/**
 * Confirm successful batch minting and update user balances
 */
const confirmBatch = async (req, res) => {
    try {
        const { batchIndex, transactionHash, userIds } = req.body;
        const adminId = req.admin.sub;

        if (!transactionHash || !userIds || !Array.isArray(userIds)) {
            return responseHelper.error(res, { message: "Invalid batch confirmation data" });
        }

        log.info(`Confirming batch ${batchIndex} with transaction ${transactionHash} for ${userIds.length} users`);

        let updatedUsers = 0;
        let totalMinted = 0;

        // Update each user's reward balance to 0 (since tokens were minted)
        for (const userId of userIds) {
            try {
                const user = await userDbHandler.getById(userId);
                if (!user) {
                    log.warn(`User not found for ID: ${userId}`);
                    continue;
                }

                const mintedAmount = user.reward;
                
                // Reset user's reward to 0
                await userDbHandler.updateOneByQuery(
                    { _id: ObjectId(userId) },
                    { $set: { reward: 0 } }
                );

                // Create income record for successful minting
                await incomeDbHandler.create({
                    user_id: ObjectId(userId),
                    amount: mintedAmount,
                    type: 6, // Minting type
                    status: 1, // Success
                    remarks: `Tokens minted successfully via secure minting - TX: ${transactionHash}`,
                    extra: {
                        transactionHash: transactionHash,
                        batchIndex: batchIndex,
                        mintedBy: adminId,
                        mintedAt: new Date(),
                        mintingMethod: "secure_metamask"
                    }
                });

                updatedUsers++;
                totalMinted += mintedAmount;
                
                log.info(`User ${user.username} (ID: ${userId}): Minted ${mintedAmount} tokens, reward reset to 0`);

            } catch (userError) {
                log.error(`Error updating user ${userId}:`, userError.message);
            }
        }

        log.info(`Batch ${batchIndex} confirmed: ${updatedUsers} users updated, ${totalMinted} tokens minted`);

        return responseHelper.success(res, {
            batchIndex: batchIndex,
            transactionHash: transactionHash,
            usersUpdated: updatedUsers,
            totalMinted: totalMinted
        }, `Batch ${batchIndex} confirmed successfully`);

    } catch (error) {
        log.error('Error confirming batch:', error.message);
        return responseHelper.error(res, { message: "Failed to confirm batch" });
    }
};

/**
 * Get minting history and statistics
 */
const getMintingHistory = async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const skip = (page - 1) * limit;

        // Get recent minting records
        const mintingRecords = await incomeDbHandler.getByQuery(
            { type: 6 }, // Minting type
            {},
            { 
                skip: parseInt(skip), 
                limit: parseInt(limit),
                sort: { created_at: -1 }
            }
        );

        // Get total count
        const totalRecords = await incomeDbHandler.countByQuery({ type: 6 });

        // Get statistics
        const stats = await incomeDbHandler.aggregate([
            { $match: { type: 6, status: 1 } },
            {
                $group: {
                    _id: null,
                    totalMinted: { $sum: "$amount" },
                    totalTransactions: { $sum: 1 },
                    avgAmount: { $avg: "$amount" }
                }
            }
        ]);

        const responseData = {
            records: mintingRecords,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalRecords / limit),
                totalRecords,
                hasNext: page * limit < totalRecords,
                hasPrev: page > 1
            },
            statistics: stats.length > 0 ? stats[0] : {
                totalMinted: 0,
                totalTransactions: 0,
                avgAmount: 0
            }
        };

        return responseHelper.success(res, responseData, "Minting history retrieved successfully");

    } catch (error) {
        log.error('Error getting minting history:', error.message);
        return responseHelper.error(res, { message: "Failed to retrieve minting history" });
    }
};

module.exports = {
    prepareMinting,
    confirmBatch,
    getMintingHistory
};
