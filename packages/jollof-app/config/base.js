/**
 * Created by iyobo on 2016-11-07.
 */

var auth = require('../app/constraints/auth.js');

module.exports = {

    env: 'development',

    //If you comment this out, an inferior memory DB will be used....
    data: {
        dataSources:{
            default: {
                adapter: require('jollof-data-mongodb'),
                nativeType: 'mongodb',
                options: {
                    mongoUrl: 'mongodb://localhost/jollofdb'
                }
            }
        }
    },

    admin: {
        enabled: true,
        auth: auth.canViewAdmin
    }

}

