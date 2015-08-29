var formalize = require('./schema.js').formalize;
var isvalid = require('./validate.js');

exports.body = module.exports.body = function(schema, options) {

	var formalizedSchema = formalize(schema);

	return function(req, res, next) {
		isvalid(req.body, formalizedSchema, function(err, validData) {
			req.body = validData;
			next(err);
		}, ['body'], options);
	};

};

exports.query = module.exports.query = function(schema, options) {

	var formalizedSchema = formalize(schema);

	return function(req, res, next) {
		isvalid(req.query, formalizedSchema, function(err, validData) {
			req.query = validData;
			next(err);
		}, ['query'], options);
	};

};

exports.param = module.exports.param = function(schema, options) {

	var formalizedSchema = formalize(schema);

	return function(req, res, next, val, id) {
		isvalid(req.params[id], formalizedSchema, function(err, validData) {
			req.params[id] = validData;
			next(err);
		}, [id], options);
	};

};
