/**
 * Created by iyobo on 2016-11-07.
 */

module.exports = {

    env: 'development',

    server: {
        port: 3005
    },

    // Uncomment to use mongodb as Default datasource. Otherwise an in-Memory datasource will be used.
    data: {
        dataSources: {
            default: {
                adapter: require('jollof-data-mongodb'),
                nativeType: 'mongodb',
                options: {
                    mongoUrl: 'mongodb://localhost/jollofdb',
                    opts: {
                        poolSize: 5 //max connections per node process for this mongodb datasource
                    }
                }
            }
        }
    },

}

