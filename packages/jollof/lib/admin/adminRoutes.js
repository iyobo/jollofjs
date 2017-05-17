/**
 * Created by iyobo on 2016-08-24.
 */
const auth = require('./constraints/adminSecurity');
const admin = require('./controllers/adminController');

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