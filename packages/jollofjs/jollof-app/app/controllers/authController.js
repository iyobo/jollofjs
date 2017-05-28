const boom = require('boom');

exports.doLogin = async (ctx) => {

    //Authenticate using the local strategy defined in app/service/passport/strategy
    //See there for other strategies.
    const authenticatedUser = await new Promise((resolve, reject)=> {
        ctx.passport.authenticate('local', function (err, user) {

            if (err) {
                reject(err);
            }

            resolve(user);
        })(ctx);
    });

    if (authenticatedUser) {
        ctx.body = { success: true };
        ctx.login(authenticatedUser);

    } else {
        //ctx.status = 401;
        ctx.body = { success: false, message: 'Invalid Credentials' };
    }


}

exports.doSignup = async (ctx) => {
    ctx.body = JSON.stringify(ctx.request.fields);
}

exports.logout = async (ctx) => {
    ctx.logout()
    ctx.redirect('/')
}


/**
 * Other potential auth endpoints
 */
//
//exports.authFacebook = async(ctx)=>{
//    await ctx.passport.authenticate('facebook');
//}
//
//exports.authFacebookCallback = async(ctx)=>{
//    await  passport.authenticate('facebook', {
//        successRedirect: '/',
//        failureRedirect: '/'
//    })
//}

