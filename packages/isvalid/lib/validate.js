var ValidationError = require('./errors/validationError.js'),
	ranges = require('./ranges.js'),
	unique = require('./unique.js'),
	schemaTools = require('./schema.js');

var finalize = function(obj, fn) {

	if (fn) return process.nextTick(function() {
		fn(null, obj);
	});

};

var validateObject = function(obj, schema, fn, keyPath, options) {

	if (obj) {

		if ('Object' != obj.constructor.name) {
			return fn(
				new ValidationError(
					keyPath,
					schema._nonFormalizedSchema,
					'type',
					(schema.errors || {}).type || 'Is not of type Object.'
				)
			);
		}

		// Copy schema
		var schemaCopy = {};
		for (var key in schema.schema) schemaCopy[key] = schema.schema[key];

		// Put validated object here
		var validObj = {};

		// Find unknown keys
		for (var key in obj) {
			if (!schemaCopy[key]) {
				if (schema.allowUnknownKeys == true || (options || {}).allowUnknownKeys == true) {
					validObj[key] = obj[key];
				} else {
					return fn(
						new ValidationError(
							keyPath.concat([key]),
							schema._nonFormalizedSchema,
							'allowUnknownKeys',
							(schema.errors || {}).allowUnknownKeys || 'Unknown key.'
						)
					);
				}
			}
		}

		var validateNextKey = function() {
			for (var key in schemaCopy) break;
			if (!key) return finalize(validObj, fn);

			var keySchema = schemaCopy[key];
			delete schemaCopy[key];

			validateAny(obj[key], keySchema, function(err, validatedObj) {
				if (err) return fn(err);
				if (validatedObj !== undefined) validObj[key] = validatedObj;
				validateNextKey();
			}, keyPath.concat([key]), options);

		};

		return validateNextKey();

	}

	return finalize(obj, fn);

};

var validateArray = function(arr, schema, fn, keyPath, options) {

	if (arr) {

		var validArray = [];

		var validateNext = function(idx) {

			if (idx == arr.length) {

				if (schema.len && !ranges.testIndex(schema.len, validArray.length)) {
					return fn(
						new ValidationError(
							keyPath,
							schema._nonFormalizedSchema,
							'len',
							(schema.errors || {}).len || 'Array length is not within range of \'' + schema.len + '\''
						)
					);
				}

				if (schema.unique) {

					return unique(validArray, function(res) {
						if (res) return finalize(validArray, fn);
						return fn(
							new ValidationError(
								keyPath,
								schema._nonFormalizedSchema,
								'unique',
								(schema.errors || {}).unique || 'Array is not unique.'
							)
						);
					});

				}

				return finalize(validArray, fn);

			}

			validateAny(arr[idx], schema.schema, function(err, validObj) {
				if (err) return fn(err);
				validArray.push(validObj);
				validateNext(idx + 1);
			}, keyPath.concat([ idx.toString() ]), options);

		};

		return validateNext(0);

	}

	return finalize(arr, fn);

};

var validateString = function(str, schema, fn, keyPath, options) {

	if (str) {

		var validStr = str;

		if ('String' != validStr.constructor.name) {
			return fn(
				new ValidationError(
					keyPath,
					schema._nonFormalizedSchema,
					'type',
					(schema.errors || {}).type || 'Is not of type string.'
				)
			);
		};

		if (schema.trim == true || (options || {}).trim == true) {
			validStr = validStr.replace(/^\s+|\s+$/g,'');
		}

		if (schema.match) {
			// We are garanteed that match is a RegExp because the finalizer has tested it.
			if (!schema.match.test(validStr)) {
				return fn(
					new ValidationError(
						keyPath,
						schema._nonFormalizedSchema,
						'match',
						(schema.errors || {}).match || 'Does not match expression ' + schema.match.source + '.'
					)
				);
			}
		}

		return finalize(validStr, fn);

	}

	return finalize(str, fn);

};

var validateNumber = function(num, schema, fn, keyPath, options) {

	if (num) {

		var validNum = num;

		if ('String' == validNum.constructor.name && /^[0-9]+(?:\.[0.9])?$/.test(num)) {
			validNum = parseFloat(validNum);
		} else if ('Number' != validNum.constructor.name) {
			return fn(
				new ValidationError(
					keyPath,
					schema._nonFormalizedSchema,
					'type',
					(schema.errors || {}).type || 'Is not of type number.'
				)
			);
		}

		if (schema.range) {
			if (!ranges.testIndex(schema.range, validNum)) {
				return fn(
					new ValidationError(
						keyPath,
						schema._nonFormalizedSchema,
						'range',
						(schema.errors || {}).range || 'Not within range of ' + schema.range
					)
				);
			}
		}

		return finalize(validNum, fn);

	}

	return finalize(num, fn);

};

var validateBoolean = function(val, schema, fn, keyPath, options) {

	if (val) {

		if ('String' == val.constructor.name && /^true|false$/i.test(val)) {
			val = /^true$/i.test(val);
		}

		if ('Boolean' != val.constructor.name) {
			return fn(
				new ValidationError(
					keyPath,
					schema._nonFormalizedSchema,
					'type',
					(schema.errors || {}).type || 'Is not of type boolean.'
				)
			);
		}

		return finalize(val, fn);

	}

	return finalize(val, fn);

};

var validateDate = function(val, schema, fn, keyPath, options) {

	if (val) {

		if ('String' == val.constructor.name ) {
			var date = new Date(val);
			if ( ! isNaN(date.getDate()) )
	 			return finalize(date, fn);

			return fn(
				new ValidationError(
					keyPath,
					schema._nonFormalizedSchema,
					'type',
					(schema.errors || {}).type || 'Is not a valid Date string.'
				)
			);
		}

		if ('Date' != val.constructor.name) {
			return fn(
				new ValidationError(
					keyPath,
					schema._nonFormalizedSchema,
					'type',
					(schema.errors || {}).type || 'Is not coerceable to a Date.'
				)
			);
		}

		return finalize(val, fn);

	}

	return finalize(val, fn);

};

var validateCustom = function(obj, schema, fn, keyPath, options) {

	return schema.custom(obj, schema, function(err, validObj) {
		if (err) {
			var stack = err.stack;
			err = new ValidationError(keyPath, schema._nonFormalizedSchema, 'custom', err.message);
			err.stack = stack;
		}
		return fn(err, validObj);
	});

};

var validateAny = function(obj, schema, fn, keyPath, options) {

	// If schema is not yet formalized - formalize it and come back.
	if (schema._nonFormalizedSchema === undefined) {
		return schemaTools.formalize(schema, function(formalizedSchema) {
			return validateAny(obj, formalizedSchema, fn, keyPath, options);
		});
	}

	if (!obj) {
		if (schema.default !== undefined) {
			if ('Function' == schema.default.constructor.name) {
				// If function has no arguments it is assumed sync.
				if (schema.default.length == 0) {
					return finalize(schema.default(), fn);
				} else {
					return schema.default(function(defaultValue) {
						finalize(defaultValue, fn);
					});
				}
			} else {
				// Else just apply default value.
				return finalize(schema.default, fn);
			}
		}
		if (schema.required == true || (options || {}).required == true) {
			return fn(
				new ValidationError(
					keyPath,
					schema._nonFormalizedSchema,
					'required',
					 (schema.errors || {}).required || 'Key is required.'
				 )
			 );
		}
	}

	if (schema.custom) return validateCustom(obj, schema, fn, keyPath, options);
	if ('Object' == schema.type.name) return validateObject(obj, schema, fn, keyPath, options);
	if ('Array' == schema.type.name) return validateArray(obj, schema, fn, keyPath, options);
	if ('String' == schema.type.name) return validateString(obj, schema, fn, keyPath, options);
	if ('Number' == schema.type.name) return validateNumber(obj, schema, fn, keyPath, options);
	if ('Boolean' == schema.type.name) return validateBoolean(obj, schema, fn, keyPath, options);
	if ('Date' == schema.type.name) return validateDate(obj, schema, fn, keyPath, options);

	// This error should have been eliminate by the finalizer.
	throw new Error('Cannot validate schema of type ' + schema.type.name + '.');

};

module.exports = function(obj, schema, fn, keyPath, options) {

	if (!schema) throw new Error('Missing parameter schema');
	if (!fn) throw new Error('Missing parameter fn');

	if (keyPath && keyPath.constructor.name == 'Object') {
		options = keyPath;
		keyPath = undefined;
	}

	keyPath = keyPath || [];

	return validateAny(obj, schema, fn, keyPath, options);

};
