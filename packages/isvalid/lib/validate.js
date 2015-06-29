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

		if (typeof obj !== 'object') {
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
			if (!key) return validateCustom(validObj, schema, fn, keyPath, options);

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

	return validateCustom(obj, schema, fn, keyPath, options);

};

var validateArray = function(arr, schema, fn, keyPath, options) {

	if (arr) {

		if (!(arr instanceof Array)) {
			return fn(
				new ValidationError(
					keyPath,
					schema._nonFormalizedSchema,
					'type',
					(schema.errors || {}).type || 'Is not an array'
				)
			);
		}

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
						if (res) return validateCustom(validArray, schema, fn, keyPath, options);
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

				return validateCustom(validArray, schema, fn, keyPath, options);

			}

			validateAny(arr[idx], schema.schema, function(err, validObj) {
				if (err) return fn(err);
				validArray.push(validObj);
				validateNext(idx + 1);
			}, keyPath.concat([ idx.toString() ]), options);

		};

		return validateNext(0);

	}

	return validateCustom(arr, schema, fn, keyPath, options);

};

var validateString = function(str, schema, fn, keyPath, options) {

	if (str) {

		var validStr = str;

		if (typeof validStr !== 'string') {
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

		// Validate enums
		if (schema.enum && schema.enum.indexOf(str) == -1) {
			return fn(
				new ValidationError(
					keyPath,
					schema._nonFormalizedSchema,
					'enum',
					(schema.errors || {}).enum || 'Possible values are ' + schema.enum.map(function(val) {
						return '\"' + val + '\"';
					}).reduce(function(prev, cur, idx, arr) {
						return prev + (idx == arr.length - 1 ? ' and ' : ', ') + cur;
					}) + '.'
				)
			)
		}

		return validateCustom(validStr, schema, fn, keyPath, options);

	}

	return validateCustom(str, schema, fn, keyPath, options);

};

var validateNumber = function(num, schema, fn, keyPath, options) {

	if (num) {

		var validNum = num;

		if (typeof validNum === 'string' && /^[0-9]+(?:\.[0-9]+)?$/.test(num)) {
			validNum = parseFloat(validNum);
		} else if (typeof validNum !== 'number') {
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

		return validateCustom(validNum, schema, fn, keyPath, options);

	}

	return validateCustom(num, schema, fn, keyPath, options);

};

var validateBoolean = function(val, schema, fn, keyPath, options) {

	if (val) {

		if (typeof val === 'string' && /^true|false$/i.test(val)) {
			val = /^true$/i.test(val);
		}

		if (typeof val !== 'boolean') {
			return fn(
				new ValidationError(
					keyPath,
					schema._nonFormalizedSchema,
					'type',
					(schema.errors || {}).type || 'Is not of type boolean.'
				)
			);
		}

		return validateCustom(val, schema, fn, keyPath, options);

	}

	return validateCustom(val, schema, fn, keyPath, options);

};

var validateDate = function(val, schema, fn, keyPath, options) {

	if (val) {

		if (typeof val === 'string') {
			var date = new Date(val);
			if (!isNaN(date.getDate()))
	 			return validateCustom(date, schema, fn, keyPath, options);

			return fn(
				new ValidationError(
					keyPath,
					schema._nonFormalizedSchema,
					'type',
					(schema.errors || {}).type || 'Is not a valid Date string.'
				)
			);
		}

		if (!(val instanceof Date)) {
			return fn(
				new ValidationError(
					keyPath,
					schema._nonFormalizedSchema,
					'type',
					(schema.errors || {}).type || 'Is not coerceable to a Date.'
				)
			);
		}

		return validateCustom(val, schema, fn, keyPath, options);

	}

	return validateCustom(val, schema, fn, keyPath, options);

};

var validateCustom = function(obj, schema, fn, keyPath, options) {

	if (schema.custom === undefined) return finalize(obj, fn);

	// Synchronous functions only have two parameters
	if (schema.custom.length < 3) {
		var res;
		try {
			res = schema.custom(obj, schema);
		} catch (err) {
			return fn(ValidationError.fromError(keyPath, schema._nonFormalizedSchema, 'custom', err));
		}
		if (typeof res === 'undefined') res = obj;
		return finalize(res, fn);
	}

	// Asynchronous function
	return schema.custom(obj, schema, function(err, validObj) {
		if (err) return fn(ValidationError.fromError(keyPath,	schema._nonFormalizedSchema, 'custom', err));
		return finalize(validObj, fn);
	});

}

var validateAny = function(obj, schema, fn, keyPath, options) {

	// If schema is not yet formalized - formalize it and come back.
	if (schema._nonFormalizedSchema === undefined) {
		return schemaTools.formalize(schema, function(formalizedSchema) {
			return validateAny(obj, formalizedSchema, fn, keyPath, options);
		});
	}

	if (typeof obj === 'undefined') {
		if (typeof schema.default !== 'undefined') {
			if (typeof schema.default === 'function') {
				// If function has no arguments it is assumed sync.
				if (schema.default.length == 0) {
					return validateCustom(schema.default(), schema, fn, keyPath, options);
				} else {
					return schema.default(function(defaultValue) {
						validateCustom(defaultValue, schema, fn, keyPath, options);
					});
				}
			} else {
				// Else just apply default value.
				return validateCustom(schema.default, schema, fn, keyPath, options);
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

	if (schema.type === undefined) return validateCustom(obj, schema, fn, keyPath, options);
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

	if (typeof schema === 'undefined') throw new Error('Missing parameter schema');
	if (typeof fn === 'undefined') throw new Error('Missing parameter fn');

	if (keyPath && typeof keyPath == 'object') {
		options = keyPath;
		keyPath = undefined;
	}

	keyPath = keyPath || [];

	return validateAny(obj, schema, fn, keyPath, options);

};
