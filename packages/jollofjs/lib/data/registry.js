/**
 * Created by iyobo on 2016-10-27.
 */
const models = {};
const types = {};
const appPaths = require('../../appPaths');

module.exports.registerModel = function(schema) {
	models[schema.name] = schema
};

module.exports.registerType = function(schema) {
	types[schema.name] = schema
};

/**
 * Populates registry with all models and types.
 * @param schema
 */
module.exports.init = function(schema) {
	//Init in-built Schema Types
	require("fs").readdirSync('./schemas').forEach(function ( schemaFilePath ) {
		require(schemaFilePath);
	});

	//Init app Schema Types
	require("fs").readdirSync(appPaths.schemaTypes).forEach(function ( schemaFilePath ) {
		require(schemaFilePath);
	});

	//Init app models
	require("fs").readdirSync(appPaths.models).forEach(function ( modelFilePath ) {
		require(modelFilePath);
	});

};

module.exports.models = models;
module.exports.types = types;