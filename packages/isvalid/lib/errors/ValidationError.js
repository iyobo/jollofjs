'use strict';

var util = require('util');

function ValidationError(keyPath, schema, validator, message) {

	Error.call(this);
	Error.captureStackTrace(this, this.constructor);

	var schemaCopy = {};
	for (var key in schema) schemaCopy[key] = schema[key];

	delete schemaCopy.schema;

	this.keyPath = keyPath;
	this.schema = schemaCopy;
	this.validator = validator;
	this.message = message;

}

util.inherits(ValidationError, Error);

ValidationError.fromError = function(keyPath, schema, validator, err) {
	var validationError = new ValidationError(keyPath, schema, validator, err.message);
	validationError.stack = err.stack;
	return validationError;
};

module.exports = ValidationError;
