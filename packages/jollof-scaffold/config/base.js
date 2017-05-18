/**
 * Created by iyobo on 2016-11-07.
 */

var auth = require('../app/constraints/auth.js');

module.exports = {

    env: 'development',

    // Uncomment to use mongodb as Default datasource. Otherwise a default in-Memory datasource will be used.
    //data: {
    //    dataSources:{
    //        default: {
    //            adapter: require('jollof-data-mongodb'),
    //            nativeType: 'mongodb',
    //            options: {
    //                mongoUrl: 'mongodb://localhost/jollofdb'
    //            }
    //        }
    //    }
    //},

    admin: {
        enabled: true,
        auth: auth.canViewAdmin
    }

}

