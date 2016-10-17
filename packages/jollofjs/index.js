/**
 * Created by iyobo on 2016-10-17.
 */
const requireDir = require('require-dir');
const bridge = require('./bridge');
const modelObj = require('./lib/loadModels')

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
			bridge.viewFilters(renderEnv);
		}
	},
	router: requireDir('./lib/router', {recurse: true}),
	utils: requireDir('./lib/util', {recurse: true}),
	cryto: require('./lib/crypto'),
	log: log,
	EL: require('./lib/bootstrapper/globals'),
	config: bridge.config.settings,
	currentEnv: bridge.config.currentEnv,
	appRoot: bridge.appRoot,
	crypto: require("./lib/crypto"),

	//data
	models: modelObj.models,
	services: bridge.services
}