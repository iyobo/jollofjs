/**
 * Created by iyobo on 2016-10-27.
 */
const models = {};
const types = {};
const services = {};
const appPaths = require('../../appPaths');
const path = require('path');
const requireDir = require('require-dir');

module.exports.registerModel = function ( schema ) {
	models[ schema.name ] = schema
};

module.exports.registerType = function ( schema ) {
	types[ schema.name ] = schema
};
module.exports.registerService = function ( name, singleton ) {
	services[ name ] = singleton
};

/**
 * Populates registry with all models and types.
 * @param schema
 */
module.exports.init = function ( schema ) {
	//Init in-built Schema Types
	requireDir(path.join(__dirname,'schemas'), {recurse: true})

	//Init app Schema Types
	requireDir(appPaths.schemaTypes, {recurse: true});

	//Init app models
	requireDir(appPaths.models, {recurse: true});

	//Init app services
	requireDir(appPaths.services, {recurse: true});


};

module.exports.models = models;
module.exports.types = types;
module.exports.services = services;