const boom = require('boom');

/**
 * Created by iyobo on 2017-05-17.
 */

/**
 * Determines if one can view the Jollof admin
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
exports.canViewAdmin = async (ctx, next) => {

    if (ctx.isAuthenticated() && ctx.state.user.isAdmin) {
        await next();
    }
    else {
        //If user is not authorized to use admin, throw a misleading redirect to avoid hinting.
        ctx.redirect('/');
    }

};

/**
 * Determines if one is logged In
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
exports.loggedIn = async (ctx, next) =>{

    if (ctx.isAuthenticated()) {
        //if (true) {
        await next();
    }
    else {
        //If user is not authorized to use admin, throw a misleading 404 to avoid hinting.
        ctx.redirect('/');
    }

};