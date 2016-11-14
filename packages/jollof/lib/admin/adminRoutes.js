/**
 * Created by iyobo on 2016-08-24.
 */


const routes = {
	// 'get /admin': {to: 'adminController index', constraint:'adminSecurity loggedIn'},
	'get /admin': {to: 'adminController index'},
	'get /api/admin/models': {to: 'adminController models'},

	'get /api/admin/v1/:modelName': {to: 'adminController list'},
	'get /api/admin/v1/:modelName/:id': {to: 'adminController get'},
	'post /api/admin/v1/:modelName': {to: 'adminController create'},
	'put /api/admin/v1/:modelName/:id': {to: 'adminController update'},
	'patch /api/admin/v1/:modelName/:id': {to: 'adminController update'},
	'delete /api/admin/v1/:modelName/:id': {to: 'adminController delete'},
}

module.exports = routes;