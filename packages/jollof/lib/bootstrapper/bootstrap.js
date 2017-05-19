/**
 * Created by iyobo on 4/22/16.
 */
const appPaths = require("../../appPaths");
const co = require('co');
const log = require('../log');
const path = require('path');

const data = require('../data');
const IO = require('koa-socket')
const io = new IO()
//const kerror = require('koa-error');
const koa = require('koa');
const config = require('../configurator');

const kc = require('koa-controller-jollof');
const koaNunjucks = require('koa-nunjucks-2');
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const serve = require('koa-static-server');
const jollof = require('../../index');
const subdomain = jollof.router.subdomain;
let serverApp;
var kBetterBody = require('koa-better-body')
//var kBody = require('koa-body')
const kValidate = require('koa-better-validation');

const httpUtil = require('../util/httpUtil');

const CSRF = require('koa-csrf');

var helmet = require('koa-helmet')
const Router = require('koa-jollof-router');

const convert = require('koa-convert') // necessary until all have been updated to support koa@2
const passport = require('koa-passport')

let modelsLoaded = false;

function* loadModels() {
    if (modelsLoaded) return;
    modelsLoaded = true;

    for (let m in data.models) {
        const modelClass = data.models[m];
        try {
            yield modelClass.setup();
            // log.debug('Setup ' + modelClass.collectionName)
        } catch (err) {
            // log.error(err);
            log.error('Error in LoadModels', err.stack)
        }
    }
}


/**
 * Default bootstrap behavior
 * @param fn
 * @returns {*}
 */
module.exports.boot = function (fn) {
    return co(function*() {
        try {

            //Load models
            yield loadModels();

            //Initialize Bootstrap globals. Access these anywhere in the app e.g env.settings.appname
            log.info("[Jollof] Starting Jollof app... \n APPROOT: " + appPaths.appRoot + " \n Env: " + process.env.NODE_ENV);

            //Run the application
            if (fn)
                return yield fn(process.argv.slice(2));

            return;
        } catch (err) {
            log.error(err.stack)
        }

    }).catch(function (err) {
        log.error("[bootstrapper] Gracefully handled exception...")
        log.error(err.stack)
        process.exit(1)
    })
}

module.exports.bootStandAlone = function (fn) {
    global.JOLLOF_STANDALONE = true;
    return module.exports.boot(fn);
}

module.exports.bootServer = function (overWriteFn) {

    return co(function*() {

        try {

            //Load models
            yield loadModels();

            //Initialize Bootstrap globals. Access these anywhere in the app e.g env.settings.appname
            log.info("[Jollof] Starting Jollof Server app... \n APPROOT: " + appPaths.appRoot);

            //Run the application

            //Set'em up------------------------------------------------------
            serverApp = new koa({
                // qs: true
            });

            // trust proxy
            serverApp.proxy = true;

            //Setup passport auth strategies
            require(appPaths.appRoot+'/app/services/passport/strategies').setupStrategies(passport);

            //wear helmet for security
            serverApp.use(helmet());

            // serverApp.use(kBody());
            serverApp.use(convert(kBetterBody({
                'multipart': true,
                querystring: require('qs')
            })));

            //koa-better-body annoyingly doesn't put fields in body. Fixes that
            serverApp.use( convert(function*(next) {
                if (this.request.fields) {
                    this.request.body = this.request.fields;
                }
                return yield next;
            }));

            //Sessions
            serverApp.keys = jollof.config.crypto.secrets;
            serverApp.use(convert(session(jollof.config, serverApp)));

            // add the CSRF middleware
            serverApp.use(new CSRF({
                invalidSessionSecretMessage: 'Invalid session secret',
                invalidSessionSecretStatusCode: 403,
                invalidTokenMessage: 'Invalid CSRF token',
                invalidTokenStatusCode: 403,
                excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
                disableQuery: false
            }));


            serverApp.use(passport.initialize());
            serverApp.use(passport.session());

            //Make session variables accesible to View renderers
            serverApp.use(convert(function*(next) {
                this.state.session = this.session;
                this.state.sessionId = this.sessionId;
                this.state.env = jollof.config.env;
                this.state.config = jollof.config;
                this.state.passport = passport;
                return yield next;
            }));

            /**
             * TODO: Create signature jollof error page
             */
            //if (!JOLLOF_STANDALONE) {
            //	serverApp.use(kerror({
            //		engine: 'nunjucks',
            //		template: appPaths.views + path.sep + 'error.nunj'
            //	}));
            //}

            //server-side form validator
            serverApp.use(convert(kValidate()));


            //app statics
            serverApp.use(convert(serve({ rootDir: 'static', rootPath: '/static' })));

            //Internal jollof statics
            serverApp.use(convert(serve({
                rootDir: JOLLOF_STANDALONE ? 'jollofstatic' : path.join('node_modules', 'jollof', 'jollofstatic'),
                rootPath: '/jollofstatic'
            })));

            //public file upload statics
            serverApp.use(convert(serve({
                rootDir: jollof.config.fileStorage.engines.local.publicRoot,
                rootPath: jollof.config.fileStorage.engines.local.basePublicUrl
            })));

            //Jollof formdata parsing
            serverApp.use(convert(function*(next) {
                yield httpUtil.objectify(this);
                return yield next;
            }));

            serverApp.use(async (ctx, next) => {

                if (ctx.method === 'GET') {
                    ctx.state.csrf = ctx.csrf;
                }

                return next();
            });

            //nunjucks
            jollof.config.nunjucks.configureEnvironment= (env) => {
                jollof.view.setupFilters(env)
            };
            serverApp.use( koaNunjucks(jollof.config.nunjucks));

            //Router
            let router = new Router();

            ////APP ROUTES
            router.addRoutes(require(process.cwd() + '/app/routes/default.js'));

            //If Admin is enabled
            if (jollof.config.admin.enabled || JOLLOF_STANDALONE) {

                router.nestRoutes(jollof.config.admin.routePrefix, jollof.config.admin.auth, require('../admin/adminRoutes'))
            }

            //Give Framework user a chance to set things up or mount stuff
            if (overWriteFn)
                overWriteFn(serverApp);


            serverApp.use(router.router.routes());
            serverApp.use(router.router.allowedMethods());

            //WEB SERVER-----------------------------------------------------
            // if(!module.parent){
            serverApp.listen(jollof.config.server.port);
            // }

            jollof.log.info("Server started on port " + jollof.config.server.port)
            /**
             * For Development MODE (Watchers and such)
             */
            // if (jollof.currentEnv == "development") {
            // 	require('./scripts/dev/watchers');
            // }

            jollof.serverApp = serverApp;

            return serverApp;
        } catch (err) {
            log.error(err.stack)
        }

    }).catch(function (err) {
        log.error("[bootstrapper] Gracefully handled exception...")
        log.error(err.stack)
        process.exit(1)
    })
}

module.exports.bootStandAloneServer = function (fn) {
    global.JOLLOF_STANDALONE = true;
    return module.exports.bootServer(fn);
}