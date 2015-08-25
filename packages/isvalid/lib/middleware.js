var isvalid = require('./validate.js');

var middleware = function(key, schema, options) {

	// We don't want the finalizer to work on every request.
	// So we finalize on the first request and then reuse
	// the finalized schema for future requests.

	// The final finalized schame.
	var finalSchema;

	return function(req, res, next) {

		// The actual validation function
		function validate() {
			isvalid(req[key], finalSchema, function(err, validObj) {
				req[key] = validObj;
				next(err);
			}, [key], options);
		};

		// Formalize and store finalSchema if not present. Otherwise just validate.
		if (finalSchema === undefined) {
      isvalid.formalize(schema, function(formalizedSchema) {
			   finalSchema = formalizedSchema;
			   validate();
		  });
    } else {
			validate();
		}

	};

};

exports.body = module.exports.body = function(schema, options) {
	return middleware('body', schema, options);
};

exports.query = module.exports.query = function(schema, options) {
	return middleware('query', schema, options);
};

exports.param = module.exports.param = function(schema, options) {

	var finalSchema;

	return function(req, res, next, val, id) {

		function validate() {
			isvalid(req.params[id], finalSchema, function(err, validData) {
				req.params[id] = validData;
				next(err);
			}, [id], options);
		};

		if (finalSchema === undefined) {
			isvalid.formalize(schema, function(formalizedSchema) {
				finalSchema = formalizedSchema;
				validate();
			});
		} else {
			validate();
		}

	};
};
