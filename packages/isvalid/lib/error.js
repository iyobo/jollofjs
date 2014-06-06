var util = require('util');

function ValidationError(keyPath, message) {
	
	Error.call(this);
	Error.captureStackTrace(this, this.constructor);
	
	this.keyPath = keyPath;
	this.message = message;
	
};

util.inherits(ValidationError, Error);

module.exports = ValidationError;
