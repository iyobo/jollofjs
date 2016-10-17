/**
 * Created by iyobo on 2016-10-17.
 */
var requireDir = require('require-dir');


module.exports = {
	bootstrap: require('./lib/bootstrapper/bootstrap'),
	EL: require('./lib/bootstrapper/globals'),
	errors: requireDir('./lib/errors', {recurse: true}),
	fileStore: require('./lib/filestorage'),
	forms: requireDir('./lib/forms', {recurse: true}),
	rest: require('./lib/illuminator'),
	filters: require('./lib/rendering'),
	setupFilters: (renderEnv)=>{
		require('./lib/rendering')(renderEnv);
		require('../../app/views/filters')(renderEnv);
	},
	router: requireDir('./lib/router', {recurse: true}),
	utils: requireDir('./lib/util', {recurse: true}),
	cryto: require('./lib/crypto'),
	log: require('./lib/log'),
}