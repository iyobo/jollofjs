var util = require('util');

function ValidationError(keyPath, schema, message) {
	
	Error.call(this);
	Error.captureStackTrace(this, this.constructor);
	
	var schemaCopy = {};
	for (var key in schema) schemaCopy[key] = schema[key];
	
	delete schemaCopy.schema;
		
	this.keyPath = keyPath;
	this.schema = schemaCopy;
	this.message = message;
	
};

util.inherits(ValidationError, Error);

module.exports = ValidationError;
