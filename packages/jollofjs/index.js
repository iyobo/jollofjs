/**
 * Created by iyobo on 2016-10-17.
 */
const requireDir = require('require-dir');
const appPaths = require('./appPaths');
// const modelObj = require('./lib/loadModels')

module.exports = {
	bootstrap: require('./lib/bootstrapper/bootstrap'),
	errors: requireDir('./lib/errors', {recurse: true}),
	fileStore: require('./lib/filestorage'),
	forms: requireDir('./lib/forms', {recurse: true}),
	rest: require('./lib/illuminator'),
	filters: require('./lib/rendering'),
	view: {
		setupFilters: ( renderEnv )=> {
			require('./lib/rendering')(renderEnv);
			require(appPaths.viewFilters)(renderEnv);
		}
	},
	router: requireDir('./lib/router', {recurse: true}),
	utils: requireDir('./lib/util', {recurse: true}),
	cryto: require('./lib/crypto'),
	log: require('./lib/log'),
	config: require('./lib/configurator').settings,
	currentEnv: require('./lib/configurator').currentEnv,
	appRoot: appPaths.appRoot,
	crypto: require("./lib/crypto"),


}

//Must be seperate from previous initialization of modules.export to avoid undefineds due to cyclic dependencies
module.exports.models = require('./lib/loadModels').models;
module.exports.services = require('../../app/services');