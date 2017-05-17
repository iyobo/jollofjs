const main = require('../controllers/mainController');

module.exports = {
    '/': { flow: main.index},
    //'get /api/v1/resource': { flow: [auth.loggedIn, admin.models] },
    //'get /api/v1/resource/:modelName': { flow: [auth.loggedIn, admin.list] },
    //'get /api/v1/resource/:modelName/:id': { flow: [auth.loggedIn, admin.get] },
    //'post /api/v1/resource/:modelName': { flow: [auth.loggedIn, admin.create] },
    //'put /api/v1/resource/:modelName/:id': { flow: [auth.loggedIn, admin.update] },
    //'patch /api/v1/resource/:modelName/:id': { flow: [auth.loggedIn, admin.update] },
    //'delete /api/v1/resource/:modelName/:id': { flow: [auth.loggedIn, admin.delete] },

}