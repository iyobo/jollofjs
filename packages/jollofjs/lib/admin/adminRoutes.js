/**
 * Created by iyobo on 2016-08-24.
 */
var helper = require('../router/helper');

const routes = {
	// 'get /admin': {to: 'adminController index', constraint:'adminSecurity loggedIn'},
	'get /admin': {to: 'adminController index'},
	'get /admin/models': {to: 'adminController models'},
	'get /admin/:modelName': {to: 'adminController list'},
}

//All api routes
helper.generateAdminAPI(routes);



module.exports = routes;