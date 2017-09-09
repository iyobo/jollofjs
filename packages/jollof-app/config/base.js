/**
 * Created by iyobo on 2016-11-07.
 */

var auth = require('../app/constraints/auth.js');

module.exports = {

    env: 'development',

    server: {
        port: 3000
    },

    /**
     * Be sure to generate a fresh secret for each app.
     * You can have multiple rotating keys
     */
    crypto: {
        secrets: ['jollofIsSweet'], //Change this!!!
        saltrounds: 8,
    },

    //If you comment this out, an inferior memory DB will be used....
    data: {
        dataSources: {
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
        auth: auth.canViewAdmin,
        logoutPath: '/logout'
    },

    thirdParty:{
        google: {
            maps: {
                apiKey: ''
            }
        }
    },

    spices: {
        blog: {
            title: 'The Journey so Far',
            subTitle: 'Powered by JollofJS',

            auth: auth.loggedIn,
            mountPath: '/blog',

            facebookUrl: '',
            twitterUrl: '',
            githubUrl: '',
            linkedInUrl: '',
        }
    }

}

