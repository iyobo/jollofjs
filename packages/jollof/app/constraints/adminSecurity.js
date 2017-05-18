module.exports = {

    // ip: function*(next) {
    // 	if (this.request.ip == '192.168.1.100') { // allow access only from this IP address
    // 		yield next;
    // 	} else {
    // 		this.body = 'Unauthorized IP address';
    // 		this.status = 401;
    // 	}
    // },

    loggedIn: function*(next) {

        if (this.isAuthenticated()) {

            //TODO: If I don't have the right privs
            //TODO: if I have the right privs
            yield next;

        }else{

            //Try to login
            yield this.login();

            console.log(this.state.user);

            this.response.redirect('/login?nextUrl=' + this.originalUrl)
        }


        //if (JOLLOF_STANDALONE || (this.session.user && this.session.user.canViewAdmin)) {
        //    // allow access only if logged in and has canViewAdmin flag
        //    yield next;
        //} else if (this.session.user) {
        //    //authenticated, but not authorized
        //    this.response.redirect('/')
        //} else {
        //    this.response.redirect('/login?nextUrl=' + this.originalUrl)
        //}
    },
    //
    // loggedInElseSignup: function*(next) {
    // 	if (this.session.user ) {
    // 		// allow access only if logged in
    // 		yield next;
    // 	} else {
    // 		this.response.redirect('/signup?nextUrl='+this.originalUrl)
    // 	}
    // },

};