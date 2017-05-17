exports.loggedIn = async function (ctx, next) {

    if (!ctx.isAuthenticated()) {

        //TODO: If I don't have the right privs
        //TODO: if I have the right privs
        await next();

    } else {

        //Try to login
        await ctx.login();

        console.log(ctx.state.user);

        ctx.response.redirect('/login?nextUrl=' + this.originalUrl)
    }


    //if (JOLLOF_STANDALONE || (this.session.user && this.session.user.isAdmin)) {
    //    // allow access only if logged in and has isAdmin flag
    //    yield next;
    //} else if (this.session.user) {
    //    //authenticated, but not authorized
    //    this.response.redirect('/')
    //} else {
    //    this.response.redirect('/login?nextUrl=' + this.originalUrl)
    //}
}