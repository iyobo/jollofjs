/**
 * Created by iyobo on 2016-08-08.
 */
var keystone = require('keystone')
//Models, Specifically Mongoose
var mongoose = require( 'mongoose' );
const bridge = require('../bridge');
var dbURI = bridge.config.db.mongodb.url;
const path = require('path');


// Create the database connection
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
	console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
	console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
	console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		console.log('Mongoose default connection disconnected through app termination');
		process.exit(0);
	});
});

keystone.init({
	'name': 'Keystone',
	'brand': 'LivingHired',
	// 'less': 'public',
	'static': 'static',
	// 'favicon': '../static/images/logo.png',
	// 'views': 'templates/views',
	// 'view engine': 'jade',
	// 'emails': 'templates/emails',
	'auto update': false,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': bridge.config.crypto.secrets[0],
	'google api key': bridge.config.google.map.key,
	port: bridge.config.server.keystonePort,
	mongoose: mongoose
});


// BRING IN SCHEMAS & MODELS
var schemaLoc = bridge.modelsPath;
var schemaPath = path.join(__dirname,schemaLoc);
var models={}
require("fs").readdirSync(schemaPath).forEach(function(file) {
	var out=require(path.join(schemaLoc,file));
	models[out.name]=out.model
});


module.exports = {
	model: mongoose.model,
	models: models,
	mongoose: mongoose
}