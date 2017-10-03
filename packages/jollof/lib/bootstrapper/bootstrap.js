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
const Boom = require('boom');

const CSRF = require('koa-csrf');

var helmet = require('koa-helmet')
const Router = require('koa-jollof-router');

const convert = require('koa-convert') // necessary until all have been updated to support koa@2


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

        //Load models
        yield loadModels();

        //Initialize Bootstrap globals. Access these anywhere in the app e.g env.settings.appname
        log.info("[Jollof] Starting Jollof Server app... \n APPROOT: " + appPaths.appRoot);

        //Run the application
        if (fn)
            return yield fn(process.argv.slice(2));


    }).catch(function (err) {
        log.error("[bootstrapper] Gracefully handled exception...")
        log.error(err.stack)
        process.exit(1)
    })
}

module.exports.bootStandAlone = function (fn) {

    return module.exports.boot(fn);
}

module.exports.bootServer = function (overWriteFn) {

    return co(function*() {

        //try {

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


        //wear helmet for security
            serverApp.use(helmet());

            // serverApp.use(kBody());
            serverApp.use(convert(kBetterBody({
                'multipart': true,
                querystring: require('qs')
            })));

            //koa-better-body annoyingly doesn't put fields in body. Fixes that
            serverApp.use(convert(function*(next) {
                if (this.request.fields) {
                    this.request.body = this.request.fields;
                }
                return yield next;
            }));

            //Sessions
            serverApp.keys = jollof.config.crypto.secrets;
            //serverApp.use(convert(session(jollof.config, serverApp)));
            serverApp.use(convert(session({
                store: redisStore(jollof.config.sessions.redis),
                // store: require("koa-generic-session/lib/memory_store")
            })));

            // add the CSRF middleware
            //serverApp.use(new CSRF({
            //    invalidSessionSecretMessage: 'Invalid session secret',
            //    invalidSessionSecretStatusCode: 403,
            //    invalidTokenMessage: 'Invalid CSRF token',
            //    invalidTokenStatusCode: 403,
            //    excludedMethods: [ 'GET', 'HEAD', 'OPTIONS','DELETE' ],
            //    disableQuery: false
            //}));


        //Make session variables accesible to View renderers
            serverApp.use(convert(function*(next) {
                this.state.session = this.session;
                this.state.sessionId = this.sessionId;
                this.state.env = jollof.config.env;
                this.state.config = jollof.config;
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
                rootDir: path.join('node_modules', 'jollof', 'jollofstatic'),
                rootPath: '/jollofstatic'
            })));

            //Spice statics
            jollof.spices.forEach((it)=>{
                if(it.statics){
                    serverApp.use(convert(serve({
                        rootDir:  it.statics.rootDir,
                        rootPath: it.statics.rootPath
                    })));
                }
            })

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

            //csrf
            serverApp.use(async (ctx, next) => {

                if (ctx.method === 'GET') {
                    ctx.state.csrf = ctx.csrf;
                }

                return next();
            });

            //nunjucks
            let nunjConfig = jollof.config.nunjucks;

            //add spice nunjucks view paths
            jollof.spices.forEach((it)=>{
                if(it.views){
                    nunjConfig.path.push(it.views.path)
                }
            })

            jollof.config.nunjucks.configureEnvironment = (env) => {
                jollof.view.setupFilters(env)
            };
            serverApp.use(koaNunjucks(jollof.config.nunjucks));

            //Router
            let router = new Router();

            ////APP ROUTES
            router.addRoutes(require(process.cwd() + '/app/routes/default.js'));

            //If Admin is enabled
            if (jollof.config.admin.enabled ) {

                router.nestRoutes(jollof.config.admin.routePrefix, jollof.config.admin.auth, require('../admin/adminRoutes'))
            }

            //spice routes
            jollof.spices.forEach((it)=>{
                if(it.routes){
                    router.nestRoutes(jollof.config.spices.blog.mountPath, it.privateBlogAuth, it.routes)
                }
            })

            //Give Framework user a chance to set things up or mount stuff
            if (overWriteFn)
                yield overWriteFn(serverApp);


            serverApp.use(router.router.routes());
            serverApp.use(router.router.allowedMethods({
                throw: true,
                notImplemented: () => new Boom.notImplemented(),
                methodNotAllowed: () => new Boom.methodNotAllowed()
            }));

            //WEB SERVER-----------------------------------------------------
            // if(!module.parent){
            serverApp.listen(jollof.config.server.port);
            // }

            jollof.log.info("Server started on port " + jollof.config.server.port)


            jollof.serverApp = serverApp;

            return serverApp;
        //} catch (err) {
        //    log.error(err.stack)
        //}

    }).catch(function (err) {
        log.error("[bootstrapper] Gracefully handled exception...")
        log.error(err.stack)
        process.exit(1)
    })
}

module.exports.bootStandAloneServer = function (fn) {

    return module.exports.bootServer(fn);
}