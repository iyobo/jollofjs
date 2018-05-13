'use strict';

var util = require('util');

function SchemaError(schema, message) {

	Error.call(this);
	Error.captureStackTrace(this, this.constructor);

	var schemaCopy = {};
	for (var key in schema) schemaCopy[key] = schema[key];

	delete schemaCopy.schema;

	this.schema = schema;
	this.message = message;

}

util.inherits(SchemaError, Error);

module.exports = SchemaError;
