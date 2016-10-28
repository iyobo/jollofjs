/**
 * Created by iyobo on 2016-10-27.
 */
const Modelizer = require('./modelizer');

const models = {};
const types = {};
const services = {};
const appPaths = require('../../appPaths');
const path = require('path');
const requireDir = require('require-dir');
const log = require('../log');

/**
 * What gets stored in models{} needs to be a fully functioning
 * mongoose-like model (e.g. findAll(), findOne, etc)...only that it's ours.
 * @param schema
 */
module.exports.registerModel = function ( schema ) {


	//Wrap whatever this is in a true Model
	models[ schema.name ] = Modelizer.modelize(schema);
};

module.exports.registerType = function ( schema ) {
	types[ schema.name ] = schema;
};
module.exports.registerService = function ( name, singleton ) {
	services[ name ] = singleton;
};

/**
 * Populates registry with all models and types.
 * @param schema
 */
module.exports.init = function ( schema ) {
	try {
		//Init in-built Schema Types
		requireDir(path.join(__dirname, 'schemas'), {recurse: true})

		//Init app Schema Types
		requireDir(appPaths.schemaTypes, {recurse: true});

		//Init app models
		requireDir(appPaths.models, {recurse: true});

		//Init app services
		requireDir(appPaths.services, {recurse: true});

	}catch(err){
		log.warn('Jollof init error:',err.message);
	}

};

module.exports.models = models;
module.exports.types = types;
module.exports.services = services;