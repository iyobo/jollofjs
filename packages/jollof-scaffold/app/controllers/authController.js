const boom = require('boom');

exports.doLogin = async (ctx) => {

    //accomodate old tech!
    await new Promise((resolve, reject)=> {
        ctx.passport.authenticate('local', function (err, user) {

            if (err) {
                console.error(err)
                ctx.body = new boom.internal(err.message);
                reject();
            }

            if (user === false) {
                //ctx.status = 401;
                ctx.body = { success: false, message: 'Invalid Credentials' };
            } else {
                ctx.body = { success: true };
                ctx.login(user);

            }
            resolve();
        })(ctx);
    });




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
//    await passport.authenticate('facebook');
//}
//
//exports.authFacebookCallback = async(ctx)=>{
//    await  passport.authenticate('facebook', {
//        successRedirect: '/',
//        failureRedirect: '/'
//    })
//}

