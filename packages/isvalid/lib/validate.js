'use strict';

var ValidationError = require('./errors/ValidationError.js'),
	ranges = require('./ranges.js'),
	unique = require('./unique.js'),
	schemaTools = require('./schema.js');

var validateObject = function(data, schema, fn, keyPath, options) {

	if (data) {

		if (typeof data !== 'object') {
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
		var key;
		for (key in schema.schema) schemaCopy[key] = schema.schema[key];

		// Put validated object here
		var validObject = {};

		// Find unknown keys
		for (key in data) {
			if (schemaCopy[key] === undefined) {
				var wasAllowUnknownKeys = schema.wasAllowUnknownKeys === true || (options || {}).wasAllowUnknownKeys === true;
				switch (schema.unknownKeys || (options || {}).unknownKeys) {
					case 'allow':
						validObject[key] = data[key];
						break;
					case 'remove':
						break;
					default:
						return fn(
							new ValidationError(
								keyPath.concat([key]),
								schema._nonFormalizedSchema,
								(wasAllowUnknownKeys ? 'allowUnknownKeys' : 'unknownKeys'),
								(wasAllowUnknownKeys ? (schema.errors || {}).allowUnknownKeys : (schema.errors || {}).unknownKeys) || 'Unknown key.'
						)
					);
				}
			}
		}

		var validateNextKey = function() {
			for (var key in schemaCopy) break;
			if (!key) return validateCustom(validObject, schema, fn, keyPath, options);

			var keySchema = schemaCopy[key];
			delete schemaCopy[key];

			validateAny(data[key], keySchema, function(err, validData) {
				if (err) return fn(err);
				if (validData !== undefined) validObject[key] = validData;
				validateNextKey();
			}, keyPath.concat([key]), options);

		};

		return validateNextKey();

	}

	return validateCustom(data, schema, fn, keyPath, options);

};

var validateArray = function(data, schema, fn, keyPath, options) {

	if (data) {

		if (!(data instanceof Array)) {

			if (schema.autowrap === true) {

				return validateAny(data, schema.schema, function(err, validData) {

					if (err) return fn(new ValidationError(
						keyPath,
						schema._nonFormalizedSchema,
						'type',
						(schema.errors || {}).type || 'Is not of type Array.'
					));

					validateArray([validData], schema, fn, keyPath, options);

				}, keyPath, options);

			} else {

				return fn(
					new ValidationError(
						keyPath,
						schema._nonFormalizedSchema,
						'type',
						(schema.errors || {}).type || 'Is not of type Array.'
					)
				);

			}
		}

		var validArray = [];

		var validateNext = function(idx) {

			if (idx == data.length) {

				if (schema.len && !ranges.testIndex(schema.len, validArray.length)) {
					return fn(
						new ValidationError(
							keyPath,
							schema._nonFormalizedSchema,
							'len',
							(schema.errors || {}).len || 'Array length is not within range of \'' + schema.len + '\'.'
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

			validateAny(data[idx], schema.schema, function(err, validData) {
				if (err) return fn(err);
				validArray.push(validData);
				validateNext(idx + 1);
			}, keyPath.concat([ idx.toString() ]), options);

		};

		return validateNext(0);

	}

	return validateCustom(data, schema, fn, keyPath, options);

};

var validateString = function(str, schema, fn, keyPath, options) {

	var validStr = str;

	if (typeof validStr !== 'string') {
		return fn(
			new ValidationError(
				keyPath,
				schema._nonFormalizedSchema,
				'type',
				(schema.errors || {}).type || 'Is not of type String.'
			)
		);
	}

	if (schema.trim === true || (options || {}).trim === true) {
		validStr = validStr.replace(/^\s+|\s+$/g,'');
	}

	if (schema.match) {
		// We are garanteed that match is a RegExp because the formalizer has tested it.
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
		);
	}

	return validateCustom(validStr, schema, fn, keyPath, options);

};

var validateNumber = function(num, schema, fn, keyPath, options) {

	var validNum = num;

	if (typeof validNum === 'string' && /^\-?[0-9]+(?:\.[0-9]+)?$/.test(num)) {
		validNum = parseFloat(validNum);
	} else if (typeof validNum !== 'number') {
		return fn(
			new ValidationError(
				keyPath,
				schema._nonFormalizedSchema,
				'type',
				(schema.errors || {}).type || 'Is not of type Number.'
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
					(schema.errors || {}).type || 'Is not of type Boolean.'
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
					(schema.errors || {}).type || 'Is not of type Date.'
				)
			);
		}

		return validateCustom(val, schema, fn, keyPath, options);

	}

	return validateCustom(val, schema, fn, keyPath, options);

};

var validateCustom = function(data, schema, fn, keyPath, options) {

	var finalize = function(data, fn) {
		if (fn) return setImmediate(fn, null, data);
	};

	// All other validators always end with calling the custom validator.
	// - therefore just finalize if there is none.
	if (schema.custom === undefined) return finalize(data, fn);

	var result = data;

	(function validateNext(idx) {
		if (idx === schema.custom.length) return finalize(result, fn);

		var custom = schema.custom[idx];

		// Synchronous functions only have two parameters
		if (custom.length < 3) {
			var res;
			try {
				res = custom(result, schema);
			} catch (err) {
				return fn(ValidationError.fromError(keyPath, schema._nonFormalizedSchema, 'custom', err));
			}
			if (typeof res !== 'undefined') result = res;
			return validateNext(idx + 1);
		}

		// Asynchronous function
		return custom(result, schema, function(err, validData) {
			if (err) return fn(ValidationError.fromError(keyPath,	schema._nonFormalizedSchema, 'custom', err));
			result = validData;
			validateNext(idx + 1);
		});

	})(0);

};

var validateAny = function(data, schema, fn, keyPath, options) {

	// If schema is not yet formalized - formalize it and come back.
	if (schema._nonFormalizedSchema === undefined) {
		return schemaTools.formalize(schema, function(formalizedSchema) {
			return validateAny(data, formalizedSchema, fn, keyPath, options);
		});
	}

	if (typeof data === 'undefined' || data === null) {
		if (data === null) {
			if (schema.allowNull === true || (options || {}).allowNull === true) {
				return validateCustom(data, schema, fn, keyPath, options);
			}
			return fn(
				new ValidationError(
					keyPath,
					schema._nonFormalizedSchema,
					'allowNull',
					(schema.errors || {}).allowNull || 'Cannot be null.'
				)
			);
		}
		if (typeof schema.default !== 'undefined') {
			if (typeof schema.default === 'function') {
				// If function has no arguments it is assumed sync.
				if (schema.default.length === 0) {
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
		if (schema.required === true || (options || {}).required === true) {
			return fn(
				new ValidationError(
					keyPath,
					schema._nonFormalizedSchema,
					'required',
					 (schema.errors || {}).required || 'Data is required.'
				 )
			 );
		} else {
			return validateCustom(data, schema, fn, keyPath, options);
		}
	}

	if (schema.type === undefined) return validateCustom(data, schema, fn, keyPath, options);
	if ('Object' == schema.type.name) return validateObject(data, schema, fn, keyPath, options);
	if ('Array' == schema.type.name) return validateArray(data, schema, fn, keyPath, options);
	if ('String' == schema.type.name) return validateString(data, schema, fn, keyPath, options);
	if ('Number' == schema.type.name) return validateNumber(data, schema, fn, keyPath, options);
	if ('Boolean' == schema.type.name) return validateBoolean(data, schema, fn, keyPath, options);
	if ('Date' == schema.type.name) return validateDate(data, schema, fn, keyPath, options);

	// This error should have been eliminated by the formalizer.
	throw new Error('Cannot validate schema of type ' + schema.type.name + '.');

};

module.exports = function(data, schema, fn, keyPath, options) {

	if (typeof schema === 'undefined') throw new Error('Missing parameter schema.');
	if (typeof fn === 'undefined') throw new Error('Missing parameter fn.');

	if (options === undefined && typeof keyPath == 'object' && keyPath.constructor.name == 'Object') {
		options = keyPath;
		keyPath = undefined;
	}

	// For backwards compatibility to before version 1.0.3
	// we change the allowUnknownKeys to unknownKeys
	if (typeof (options || {}).allowUnknownKeys === 'boolean') {
		if (!process.env.ISVALID_SILENCE) {
			console.error('isvalid: DEPRECATED: Validator allowUnknownKeys has been deprecated in favour of unknownKeys as of version 1.0.4. See README for more info.');
		}
		options.unknownKeys = (options.allowUnknownKeys ? 'allow' : 'deny');
		options.wasAllowUnknownKeys = true;
		delete options.allowUnknownKeys;
	}

	keyPath = keyPath || [];

	return validateAny(data, schema, fn, keyPath, options);

};
