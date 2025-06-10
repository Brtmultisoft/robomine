const Router = require('express').Router();
/**
 * All Controllers
 */
const {
    publicController
} = require('../../controllers');

/**
 * All Middlewares
 */

const {
    webhookMiddleware
} = require("../../middlewares");


module.exports = () => {

    // RBM Whitelist Public Routes
    Router.get("/rbm-whitelist/status/:address", publicController.getRBMWhitelistStatus);
    Router.post("/rbm-whitelist/register", publicController.registerRBMWhitelist);
    Router.get("/rbm-whitelist/stats", publicController.getRBMWhitelistStats);
    Router.get("/rbm-whitelist/users", publicController.getRBMWhitelistUsers);

    // Router.get("/get-reports-in-csv/:name", publicController.getReportsByQuery);

    return Router;
}
