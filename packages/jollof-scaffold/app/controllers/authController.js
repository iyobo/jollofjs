

exports.doLogin = async (ctx) => {
    return ctx.passport.authenticate('local', function(err, user) {
        if (user === false) {
            //ctx.status = 401
            ctx.body = { success: false ,  message: 'Invalid Credentials'}
        } else {
            ctx.body = { success: true }
            return ctx.login(user)
        }
    })(ctx)
}

exports.doSignup = async (ctx) => {
    ctx.body = JSON.stringify(ctx.request.fields);
}

exports.logout = async (ctx) => {
    ctx.logout()
    ctx.redirect('/')
}