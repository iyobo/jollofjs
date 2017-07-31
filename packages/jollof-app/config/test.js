/**
 * Created by iyobo on 2016-11-07.
 */

module.exports = {

    env: 'test',

    server: {
        port: 3002, //Port main app runs on
        host: '0.0.0.0',
        hostname: 'localhost'
    },

    // Uncomment to use mongodb as Default datasource. Otherwise an in-Memory datasource will be used.
    //data: {
    //    dataSources:{
    //        default: {
    //            adapter: require('jollof-data-mongodb'),
    //            nativeType: 'mongodb',
    //            options: {
    //                mongoUrl: 'mongodb://localhost/jollofdb_test'
    //            }
    //        }
    //    }
    //},

}

