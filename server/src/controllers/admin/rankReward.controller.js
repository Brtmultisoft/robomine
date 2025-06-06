const responseHelper = require('../../utils/customResponse');
const logger = require('../../services/logger');
const log = new logger('RankRewardController').getChildLogger();
const { userDbHandler, incomeDbHandler } = require('../../services/db');
const { ObjectId } = require('mongodb');

const rankRewardController = {
    // Get pending rank rewards for admin approval
    getPendingRankRewards: async (req, res) => {
        let responseData = {};
        try {
            // Get users with pending rank rewards
            const usersWithPendingRewards = await userDbHandler.getByQuery({
                "extra.pendingRankReward.status": "pending"
            });

            const pendingRewards = usersWithPendingRewards.map(user => ({
                userId: user._id,
                username: user.username,
                name: user.name,
                rank: user.extra.pendingRankReward.rank,
                rankName: user.extra.pendingRankReward.rankName,
                amount: user.extra.pendingRankReward.amount,
                rewardType: user.extra.pendingRankReward.rewardType,
                achievedAt: user.extra.pendingRankReward.achievedAt,
                currentRank: user.extra.rank,
                joinedAt: user.created_at
            }));

            responseData.data = pendingRewards;
            responseData.msg = "Pending rank rewards fetched successfully";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('Failed to fetch pending rank rewards:', error);
            responseData.msg = "Failed to fetch pending rank rewards";
            return responseHelper.error(res, responseData);
        }
    },

    // Approve or reject rank reward
    approveRankReward: async (req, res) => {
        let responseData = {};
        const { userId, action, adminId } = req.body; // action: 'approve' or 'reject'
        
        try {
            const user = await userDbHandler.getOneByQuery({ _id: ObjectId(userId) });
            
            if (!user || !user.extra?.pendingRankReward) {
                responseData.msg = "No pending rank reward found for this user";
                return responseHelper.error(res, responseData);
            }

            const pendingReward = user.extra.pendingRankReward;
            
            if (action === 'approve') {
                // Award the reward
                const updateQuery = {
                    $set: {
                        "extra.pendingRankReward.status": "approved",
                        "extra.pendingRankReward.approvedBy": adminId,
                        "extra.pendingRankReward.approvedAt": new Date()
                    },
                    $inc: {
                        "extra.dailyBonus": pendingReward.amount,
                        "extra.totalBonus": pendingReward.amount,
                        "extra.totalIncome": pendingReward.amount
                    }
                };

                // Add to appropriate wallet
                if (pendingReward.rewardType === "RBM_TOKEN") {
                    updateQuery.$inc.reward = pendingReward.amount;
                } else if (pendingReward.rewardType === "E_WALLET") {
                    updateQuery.$inc.wallet = pendingReward.amount;
                }

                await userDbHandler.updateOneByQuery({ _id: ObjectId(userId) }, updateQuery);

                // Update income record status
                await incomeDbHandler.updateOneByQuery(
                    { 
                        user_id: ObjectId(userId), 
                        type: 5,
                        "extra.rankAchieved": pendingReward.rank,
                        status: 0
                    },
                    { 
                        $set: { 
                            status: 1, // approved
                            remarks: `${pendingReward.rankName} qualification bonus - ${pendingReward.rewardType} (Approved)`
                        } 
                    }
                );

                responseData.msg = `Rank reward approved and ${pendingReward.amount} ${pendingReward.rewardType} awarded to user`;
                
            } else if (action === 'reject') {
                // Reject the reward
                await userDbHandler.updateOneByQuery(
                    { _id: ObjectId(userId) },
                    {
                        $set: {
                            "extra.pendingRankReward.status": "rejected",
                            "extra.pendingRankReward.approvedBy": adminId,
                            "extra.pendingRankReward.approvedAt": new Date()
                        }
                    }
                );

                // Update income record status
                await incomeDbHandler.updateOneByQuery(
                    { 
                        user_id: ObjectId(userId), 
                        type: 5,
                        "extra.rankAchieved": pendingReward.rank,
                        status: 0
                    },
                    { 
                        $set: { 
                            status: 2, // rejected
                            remarks: `${pendingReward.rankName} qualification bonus - ${pendingReward.rewardType} (Rejected)`
                        } 
                    }
                );

                responseData.msg = "Rank reward rejected";
            }

            return responseHelper.success(res, responseData);
            
        } catch (error) {
            log.error('Failed to process rank reward approval:', error);
            responseData.msg = "Failed to process rank reward approval";
            return responseHelper.error(res, responseData);
        }
    },

    // Get all rank rewards history (approved, rejected, pending)
    getRankRewardsHistory: async (req, res) => {
        let responseData = {};
        try {
            const users = await userDbHandler.getByQuery({
                "extra.pendingRankReward": { $exists: true }
            });

            const rewardsHistory = users.map(user => ({
                userId: user._id,
                username: user.username,
                name: user.name,
                rank: user.extra.pendingRankReward.rank,
                rankName: user.extra.pendingRankReward.rankName,
                amount: user.extra.pendingRankReward.amount,
                rewardType: user.extra.pendingRankReward.rewardType,
                achievedAt: user.extra.pendingRankReward.achievedAt,
                status: user.extra.pendingRankReward.status,
                approvedBy: user.extra.pendingRankReward.approvedBy,
                approvedAt: user.extra.pendingRankReward.approvedAt,
                currentRank: user.extra.rank
            }));

            responseData.data = rewardsHistory;
            responseData.msg = "Rank rewards history fetched successfully";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('Failed to fetch rank rewards history:', error);
            responseData.msg = "Failed to fetch rank rewards history";
            return responseHelper.error(res, responseData);
        }
    }
};

module.exports = rankRewardController;
