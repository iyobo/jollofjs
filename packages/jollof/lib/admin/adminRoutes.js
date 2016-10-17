/**
 * Created by iyobo on 2016-08-24.
 */
var helper = require('./helper');

const routes = {
	'get /admin': {to: 'adminController index', constraint:'adminSecurity loggedIn'},
}

//All api routes
helper.generateAdminAPI(routes);



module.exports = routes;