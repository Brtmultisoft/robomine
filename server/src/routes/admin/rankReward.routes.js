const express = require('express');
const Router = express.Router();
const rankRewardController = require('../../controllers/admin/rankReward.controller');

// Get pending rank rewards for admin approval
Router.get('/pending', rankRewardController.getPendingRankRewards);

// Approve or reject rank reward
Router.post('/approve', rankRewardController.approveRankReward);

// Get all rank rewards history
Router.get('/history', rankRewardController.getRankRewardsHistory);

module.exports = Router;
