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
		if (this.session.user ) {
			// allow access only if logged in
			yield next;
		} else {
			this.response.redirect('/login?nextUrl='+this.originalUrl)
		}
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