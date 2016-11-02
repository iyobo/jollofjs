/**
 * Created by iyobo on 2016-10-17.
 */
const requireDir = require('require-dir');
const appPaths = require('./appPaths');
const co = require('co');
const data = require('./lib/data');
const _ = require('lodash');

const log = require('./lib/log');

module.exports = {
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
	log: log,
	config: require('./lib/configurator').settings,
	currentEnv: require('./lib/configurator').currentEnv,
	appRoot: appPaths.appRoot,
	crypto: require("./lib/crypto"),

}

//Must be seperate from previous initialization of modules.export to avoid undefineds due to cyclic dependencies
module.exports.data = data;
module.exports.models = data.models;
module.exports.services = data.services;

//Initialize project DataVerse
data.init();

// setTimeout(()=>{
module.exports.bootstrap = require('./lib/bootstrapper/bootstrap');
// },2000)

// co(function*() {
//
// 	for(let m in data.models){
// 		const modelClass = data.models[m];
// 		try {
// 			yield modelClass.setup();
// 			log.debug('Setup ' + modelClass.collectionName)
// 		}catch(err){
// 			log.error(err);
// 		}
// 	}
// 	// module.exports.bootstrap = require('./lib/bootstrapper/bootstrap');
// });

