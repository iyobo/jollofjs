/**
 * Created by iyobo on 2016-11-07.
 */

var auth = require('../app/constraints/auth.js');

module.exports = {

    env: 'development',

    server: {
        port: 3000
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
        auth: auth.canViewAdmin
    },

    spices: {
        blog: {
            title: 'Tasty Blog',
            subTitle: 'Powered by JollofJS',

            aboutTitle: 'About Me',
            contactTitle: 'Contact Me',

            bioText: `<p>Hey there, I love Brussel sprouts</p><p>...And Cabbage!</p>`,
            contactText: `<p>Use one of the social buttons below to reach me</p>`,

            auth: auth.loggedIn,
            mountPath: '/blog',

            facebookUrl: '',
            twitterUrl: '',
            githubUrl: '',
            linkedInUrl: '',
        }
    }

}

