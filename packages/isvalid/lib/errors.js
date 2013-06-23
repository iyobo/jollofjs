var util = require('util');

var CustomError = function(name, message, httpCode) {
	Error.call(this);
	Error.captureStackTrace(this, arguments.callee);
	this.name = name || 'unknown-error';
	this.message = message || 'Unknown error.';
	this.httpCode = httpCode || 400;
};

var ValidationError = function(message) {
	CustomError.call(this, 'validation-error', message);
}

util.inherits(ValidationError, CustomError);

module.exports = {
	Custom: CustomError,
	Validation: ValidationError,
};
