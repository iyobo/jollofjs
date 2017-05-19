

exports.doLogin = async (ctx) => {
    ctx.state.passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/'
    });

}

exports.doSignup = async (ctx) => {
    ctx.body = JSON.stringify(ctx.request.fields);
}

exports.logout = async (ctx) => {
    ctx.logout()
    ctx.redirect('/')
}