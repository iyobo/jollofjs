/**
 * Created by iyobo on 2016-08-24.
 */
const auth = require('./constraints/adminSecurity');
const admin = require('./controllers/adminController');

module.exports = {
    '/': { flow: admin.index },
    'get /api/v1/resource': { flow: admin.models },
    'get /api/v1/resource/:modelName': { flow: admin.list },
    'get /api/v1/resource/:modelName/:id': { flow: admin.get },
    'post /api/v1/resource/:modelName': { flow: admin.create },
    'put /api/v1/resource/:modelName/:id': { flow: admin.update },
    'patch /api/v1/resource/:modelName/:id': { flow: admin.update },
    'delete /api/v1/resource/:modelName/:id': { flow: admin.delete},

}