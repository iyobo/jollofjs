/**
 * Created by iyobo on 2016-08-24.
 */
const auth = require('./constraints/adminSecurity');
const admin = require('./controllers/adminController');


//const routes = {
//	'get /admin': {to: 'adminController index', constraint:'adminSecurity loggedIn'},
//	'get /admin2': {to: 'adminController index2', constraint:'adminSecurity loggedIn'},
//
//	// 'get /admin': {to: 'adminController index'},
//	'get /api/v1/resource': {to: 'adminController models', constraint:'adminSecurity loggedIn'},
//
//	'get /api/v1/resource/:modelName': {to: 'adminController list', constraint:'adminSecurity loggedIn'},
//	'get /api/v1/resource/:modelName/:id': {to: 'adminController get', constraint:'adminSecurity loggedIn'},
//	'post /api/v1/resource/:modelName': {to: 'adminController create', constraint:'adminSecurity loggedIn'},
//	'put /api/v1/resource/:modelName/:id': {to: 'adminController update', constraint:'adminSecurity loggedIn'},
//	'patch /api/v1/resource/:modelName/:id': {to: 'adminController update', constraint:'adminSecurity loggedIn'},
//	'delete /api/v1/resource/:modelName/:id': {to: 'adminController delete', constraint:'adminSecurity loggedIn'},
//};


//module.exports = routes;

module.exports = {
    '/': { flow: [auth.loggedIn, admin.index] },
    'get /api/v1/resource': { flow: [auth.loggedIn, admin.models] },
    'get /api/v1/resource/:modelName': { flow: [auth.loggedIn, admin.list] },
    'get /api/v1/resource/:modelName/:id': { flow: [auth.loggedIn, admin.get] },
    'post /api/v1/resource/:modelName': { flow: [auth.loggedIn, admin.create] },
    'put /api/v1/resource/:modelName/:id': { flow: [auth.loggedIn, admin.update] },
    'patch /api/v1/resource/:modelName/:id': { flow: [auth.loggedIn, admin.update] },
    'delete /api/v1/resource/:modelName/:id': { flow: [auth.loggedIn, admin.delete] },

}