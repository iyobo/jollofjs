/**
 * Created by iyobo on 2016-11-07.
 */
const os = require('os');
const path = require('path');
const appPaths = require('../../appPaths');
var firstExistingPath = require('../util/fileUtil.js').firstExistingPath;
/**
 * These are your base app configs.
 * Every one of your environment config files inherit the values here.
 * Created by iyobo on 2016-03-22.
 */
module.exports = {
    appName: "Jollof App",

    server: {
        port: 3000, //Port main app runs on
        host: '0.0.0.0',
        hostname: 'localhost'
    },

    admin: {
        enabled: true,
        routePrefix: '/admin',
        auth: async (ctx, next) => {
            //No auth by default
            await next()
        }

    },

    domains: {
        default: 'http://localhost:3000',
    },

    env: 'development',

    data: {
        dataSources: {
            default: {
                adapter: require('jollof-data-memory'),
                nativeType: 'memory',
                options: {
                    filename: '/tmp/jollofdb',
                    autoload: true
                }
            }
        }
    },

    sessions: {
        key: 'jollof:sess', /** (string) cookie key (default is koa:sess) */
        maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
        overwrite: true, /** (boolean) can overwrite or not (default true) */
        httpOnly: true, /** (boolean) httpOnly or not (default true) */
        signed: true, /** (boolean) signed or not (default true) */

        /**
         * see https://www.npmjs.com/package/redis#options-is-an-object-with-the-following-possible-properties
         * Also, only using redis directly for sessions, not as a model engine, so no model adapter needed.
         */
        redis: {
            host: "127.0.0.1",
            port: 6379,
            db: 0
        },
    },

    /**
     * Be sure to generate a fresh secret for each app.
     * You can have multiple rotating keys
     */
    crypto: {
        secrets: ['jollofIsSweet'],
        saltrounds: 8,
    },

    cookies: {
        expiry: 120,
        names: {
            app: 'APP',
        },
    },

    nunjucks: {
        ext: 'nunj',
        path: ['app/views', firstExistingPath(['lib/admin/views', 'node_modules/jollof/lib/admin/views'])], //from project root
        nunjucksConfig: {
            //see https://mozilla.github.io/nunjucks/api.html#configure
            noCache: true,
            autoescape: false
        },
    },

    fileStorage: {
        defaultEngine: 'local',
        engines: {
            local: {
                privateRoot: path.join(appPaths.appRoot, 'uploads', 'private'), //Where to store private files
                publicRoot: path.join(appPaths.appRoot, 'uploads', 'public'), //Where to store public files that can be accessed by the internet (e.g. like in a CMS)
                basePublicUrl: '/jollofuploads'
            },
            s3: {}
        }
    },

    thirdParty: {
        google: {
            maps: {
                apiKey: ''
            }
        }
    },

}

