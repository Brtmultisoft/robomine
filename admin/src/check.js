'use strict';
/**
 * Script to ban all users under a specific ID
 *
 * This script will:
 * 1. Find all users with refer_id equal to the specified ID
 * 2. Update their status to false (banned)
 * 3. Recursively find and ban all users in the downline
 */
// Import required modules
const mongoose = require('mongoose');
// Using console.log instead of logger to avoid initialization issues
const { userDbHandler, investmentDbHandler } = require('./src/services/db');
const { getChildLevelsByRefer } = require('./src/services/commonFun');
// The ID of the user whose downline we want to ban
const TARGET_ID = '67b5ec091f2ddfca898ef1a8';
// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://robomine:robomine123@cluster0.ta5o4.mongodb.net/robomine?retryWrites=true&w=majority&appName=Cluster0");
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
// Function to ban a user by ID
const banUser = async (userId) => {
    try {
        const result = await investmentDbHandler.updateByQuery({user_id: mongoose.Types.ObjectId(userId)}, { status: 2 });
        return result;
    } catch (error) {
        console.log(`Error banning user ${userId}:`, error);
        return null;
    }
};
// Function to ban all users in a list
const banUsers = async (userIds) => {
    let bannedCount = 0;
    let failedCount = 0;
    for (const userId of userIds) {
        const result = await banUser(userId);
        if (result) {
            bannedCount++;
            console.log(`Successfully banned user: ${userId}`);
        } else {
            failedCount++;
            console.log(`Failed to ban user: ${userId}`);
        }
    }
    return { bannedCount, failedCount };
};
// Function to get all users in the downline of a specific user
const getAllDownlineUsers = async (userId) => {
    try {
        // Get all levels of users in the downline
        const levels = await getChildLevelsByRefer(userId, false);
        // Flatten the array of levels into a single array of users
        let allUsers = [];
        for (let i = 1; i < levels.length; i++) {
            // Extract user IDs from each level
            const userIds = levels[i].map(user => user._id);
            allUsers = [...allUsers, ...userIds];
        }
        return allUsers;
    } catch (error) {
        console.log(`Error getting downline users for ${userId}:`, error);
        return [];
    }
};
// Main function to execute the script
const main = async () => {
    try {
        // Connect to the database
        await connectDB();
        console.log(`Starting to ban all users under ID: ${TARGET_ID}`);
        // Get all users in the downline
        const allDownlineUsers = await getAllDownlineUsers(TARGET_ID);
        console.log(`Found ${allDownlineUsers.length} users in the downline`);
        if (allDownlineUsers.length === 0) {
            console.log('No users found in the downline. Exiting.');
            process.exit(0);
        }
        // Ban all users in the downline
        const { bannedCount, failedCount } = await banUsers(allDownlineUsers);
        console.log(`Banned ${bannedCount} users successfully`);
        if (failedCount > 0) {
            console.log(`Failed to ban ${failedCount} users`);
        }
        console.log('Script execution completed');
        process.exit(0);
    } catch (error) {
        console.log('Error executing script:', error);
        process.exit(1);
    }
};
// Execute the main function
main();