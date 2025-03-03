const Router = require('express').Router();
/**
 * All Controllers
 */
const {
    cronController
} = require('../../controllers');

/**
 * All Middlewares
 */

const {
    cronMiddleware
} = require("../../middlewares");


module.exports = () => {

    /**********************
     * AUTHORIZED ROUTES
     **********************/
    /**
     * Middlerware for Handling Request Authorization
     */
    Router.use('/', cronMiddleware)

    // EXCEPTION FOR GIT PULL
    // Router.get("/restartProj", cronController.restartProj)

    // // /** CRON ROUTES */
    // Router.post("/updateTeamInvestment", cronController.updateTeamInvestment)
    // Router.post("/updateMatchingBonus", cronController.updateMatchingBonus)
    // Router.post("/updateVIPBonus", cronController.updateVIPBonus)
    // Router.post("/updateROI", cronController.roi)

    // Router.post("/assignTokens", cronController.assignTokens)
    // Router.post("/resetAssignTokens", cronController.resetAssignTokens)

    // Router.post("/withdrawCron", cronController.withdrawCron)
    Router.post("/distributeCron", cronController.distributeTokensHandler)
    Router.post("/autoFundDistribution", cronController.AutoFundDistribution)
    /**************************
     * END OF AUTHORIZED ROUTES
     **************************/
    return Router;
}
