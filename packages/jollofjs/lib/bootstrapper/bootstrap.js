/**
 * Created by iyobo on 4/22/16.
 */
const appPaths = require("../../appPaths");
const co = require('co');
const log = require('../log')

const data = require('../data');
const IO = require('koa-socket')
const io = new IO()
const kerror = require('koa-error');
const koa = require('koa');

const kc = require('koa-controller');
const koaNunjucks = require('koa-nunjucks-2');
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const serve = require('koa-static-server');
const jollof = require('jollof');
const subdomain = jollof.router.subdomain;
let serverApp;
const formidable = require('koa-formidable')

function* loadModels(){
	for(let m in data.models){
		const modelClass = data.models[ m ];
		try {
			yield modelClass.setup();
			// log.debug('Setup ' + modelClass.collectionName)
		} catch (err) {
			// log.error(err);
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
			log.info("[Jollof] Starting Jollof app... \n APPROOT: "+appPaths.appRoot);

			//Run the application
			return yield fn(process.argv.slice(2));
		}catch(err){
			log.error(err.stack)
		}

	}).catch(function (err) {
		log.error("[bootstrapper] Gracefully handled exception...")
		log.error(err.stack)
		process.exit(1)
	})
}

module.exports.bootServer = function (overWriteFn) {
	return co(function*() {
		try {

			//Load models
			yield loadModels();

			//Initialize Bootstrap globals. Access these anywhere in the app e.g env.settings.appname
			log.info("[Jollof] Starting Jollof Server app... \n APPROOT: "+appPaths.appRoot);

			//Run the application

			//Set'em up------------------------------------------------------
			serverApp = new koa();


			//Sessions
			serverApp.keys = jollof.config.crypto.secrets;
			serverApp.use(session({
				store: redisStore(jollof.config.db.redis)
				// store: require("koa-generic-session/lib/memory_store")
			}));

			serverApp.use(kerror({
				engine: 'nunjucks',
				template: appPaths.appRoot + '/app/views/error.nunj'
			}));

			//Make session variables accesible to View renderers
			serverApp.use(function*( next) {
				this.state.session = this.session;
				this.state.sessionId = this.sessionId;
				this.state.env = jollof.config.env;
				this.state.config = jollof.config;
				return yield next;
			});


			//forms
			serverApp.use(require('koa-body')());
			serverApp.use(require('koa-validate')());

			//contoller/router
			serverApp.use(kc.tools()); // optional

			//app statics
			serverApp.use(serve({rootDir: 'static', rootPath: '/static'}));

			//Internal jollof statics
			serverApp.use(serve({rootDir: 'node_modules/jollof/static', rootPath: '/jollofstatic'}));



			//Subdomain Routing
			serverApp.use(subdomain('emp', kc.router({
				routesPath: process.cwd() + '/app/routes/empRoutes.js',
			})));
			serverApp.use(subdomain('*', kc.router({
				routesPath: process.cwd() + '/app/routes/defaultRoutes.js',
			})));

			//nunjucks
			serverApp.context.render = koaNunjucks(jollof.config.nunjucks);

			//add nunjuck filters/extensions
			jollof.view.setupFilters(serverApp.context.render.env);




			//If Admin is enabled
			if (jollof.config.admin.enabled) {
				//KEYSTONE API: ADMIN SERVER
				// require('./admin');
				//
				//jollof admin
				serverApp.use(kc.router({
					routesPath: process.cwd() + '/node_modules/jollof/lib/admin/adminRoutes.js',
					constraintPath: process.cwd() + '/node_modules/jollof/lib/admin/constraints/{constraint}.js',
					controllerPath: process.cwd() + '/node_modules/jollof/lib/admin/controllers/{controller}.js'
				}));
			}


			//Give Framework user a chance to set things stuff
			overWriteFn(serverApp);

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

			return serverApp;
		}catch(err){
			log.error(err.stack)
		}

	}).catch(function (err) {
		log.error("[bootstrapper] Gracefully handled exception...")
		log.error(err.stack)
		process.exit(1)
	})
}
