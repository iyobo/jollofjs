var ValidationError = require('./error.js'),
	ranges = require('./ranges.js'),
	unique = require('./unique.js'),
	schemaTools = require('./schema.js');

var validateObject = function(obj, schema, callback, keyPath) {
	
	if (obj) {
		
		if ('Object' != obj.constructor.name) {
			return callback(
				new ValidationError(
					keyPath,
					schema,
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
				if (schema.allowUnknownKeys == true) {
					validObj[key] = obj[key];
				} else {
					return callback(
						new ValidationError(
							keyPath.concat([key]),
							schema,
							'allowUnknownKeys',
							(schema.errors || {}).allowUnknownKeys || 'Unknown key.'
						)
					);
				}
			}
		}
		
		var validateNextKey = function() {
			for (var key in schemaCopy) break;
			if (!key) return callback(null, validObj);
		
			var keySchema = schemaCopy[key];
			delete schemaCopy[key];
			
			validateAny(obj[key], keySchema, function(err, validatedObj) {
				if (err) return callback(err);
				validObj[key] = validatedObj;
				validateNextKey();
			}, keyPath.concat([key]));
			
		};
		
		return validateNextKey();
		
	}
	
	return callback(null, obj);
	
};

var validateArray = function(arr, schema, callback, keyPath) {
	
	if (arr) {
		
		var validArray = [];
		
		var validateNext = function(idx) {
			
			if (idx == arr.length) {
				
				if (schema.len && !ranges.testIndex(schema.len, validArray.length)) {
					return callback(
						new ValidationError(
							keyPath,
							schema,
							'len',
							(schema.errors || {}).len || 'Array length is not within range of \'' + schema.len + '\''
						)
					);
				}
				
				if (schema.unique && validArray.length > 1) {
					for (var idx1 = 0 ; idx1 < validArray.length - 1 ; idx1++) {
						for (var idx2 = idx1 + 1 ; idx2 < validArray.length ; idx2++ ) {
							if (unique.equals(validArray[idx1], validArray[idx2])) {
								keyPath = keyPath.concat([ idx1.toString() ]);
								return callback(
									new ValidationError(
										keyPath,
										schema,
										'unique',
										(schema.errors || {}).unique || 'Is not unique.'
									)
								);
							}
						}
					}
				}
				
				return callback(null, validArray);
				
			}
			
			validateAny(arr[idx], schema.schema, function(err, validObj) {
				if (err) return callback(err);
				validArray.push(validObj);
				validateNext(idx + 1);
			}, keyPath.concat([ idx.toString() ]));
			
		};
		
		return validateNext(0);
				
	}
	
	return callback(null, arr);
	
};

var validateString = function(str, schema, callback, keyPath) {
	
	if (str) {
		
		var validStr = str;
	
		if ('String' != validStr.constructor.name) {
			return callback(
				new ValidationError(
					keyPath,
					schema,
					'type',
					(schema.errors || {}).type || 'Is not of type string.'
				)
			);
		};
		
		if (schema.trim) {
			validStr = validStr.replace(/^\s+|\s+$/g,'');
		}
	
		if (schema.match) {
			if ('RegExp' != schema.match.constructor.name) {
				throw new Error('Schema {type: String}: match is not a RegExp.');
			}
			if (!schema.match.test(validStr)) {
				return callback(
					new ValidationError(
						keyPath,
						schema,
						'match',
						(schema.errors || {}).match || 'Does not match expression ' + schema.match.source + '.'
					)
				);
			}
		}
		
		return callback(null, validStr);
		
	}
	
	return callback(null, str);
	
};

var validateNumber = function(num, schema, callback, keyPath) {
	
	if (num) {
		
		var validNum = num;
	
		if ('String' == validNum.constructor.name && /^[0-9]+(?:\.[0.9])?$/.test(num)) {
			validNum = parseFloat(validNum);
		} else if ('Number' != validNum.constructor.name) {
			return callback(
				new ValidationError(
					keyPath,
					schema,
					'type',
					(schema.errors || {}).type || 'Is not of type number.'
				)
			);
		}
		
		if (schema.range) {
			if (!ranges.testIndex(schema.range, validNum)) {
				return callback(
					new ValidationError(
						keyPath,
						schema,
						'range',
						(schema.errors || {}).range || 'Not within range of ' + schema.range
					)
				);
			}
		}
		
		return callback(null, validNum);
		
	}
	
	return callback(null, num);
	
};

var validateBoolean = function(val, schema, callback, keyPath) {
	
	if (val) {
		
		if ('String' == val.constructor.name && /^true|false$/i.test(val)) {
			val = /^true$/i.test(val);
		}
		
		if ('Boolean' != val.constructor.name) {
			return callback(
				new ValidationError(
					keyPath,
					schema,
					'type',
					(schema.errors || {}).type || 'Is not of type boolean.'
				)
			);
		}
		
		return callback(null, val);
		
	}
	
	return callback(null, val);
	
};

var validateDate = function(val, schema, callback, keyPath) {
	
	if (val) {
		
		if ('String' == val.constructor.name ) {
			var date = new Date(val);
			if ( ! isNaN(date.getDate()) )
	 			return callback(null,date);

			return callback(
				new ValidationError(
					keyPath,
					schema,
					'type',
					(schema.errors || {}).type || 'Is not a valid Date string.'
				)
			);
		}

		if ('Date' != val.constructor.name) {
			return callback(
				new ValidationError(
					keyPath,
					schema,
					'type',
					(schema.errors || {}).type || 'Is not coerceable to a Date.'
				)
			);
		}
		
		return callback(null, val);
		
	}
	
	return callback(null, val);
	
};

var validateCustom = function(obj, schema, callback, keyPath) {
	
	return schema.custom(obj, schema, function(err, validObj) {
		if (err) {
			var stack = err.stack;
			err = new ValidationError(keyPath, schema, 'custom', err.message);
			err.stack = stack;
		}
		return callback(err, validObj);
	});
	
};

var validateAny = function(obj, schema, callback, keyPath) {
	
	// If schema is not yet formalized - formalize it and come back.
	if (schema._formalized !== true) {
		return schemaTools.formalize(schema, function(formalizedSchema) {
			return validateAny(obj, formalizedSchema, callback, keyPath);
		});
	}
	
	if (!obj) {
		if (schema.default) {
			if ('Function' == schema.default.constructor.name) {
				return schema.default(function(defaultValue) {
					callback(null, defaultValue);
				});
			} else {
				return callback(null, schema.default);
			}
		}
		if (schema.required) {
			return callback(
				new ValidationError(
					keyPath,
					schema,
					'required',
					 (schema.errors || {}).required || 'Key is required.'
				 )
			 );
		}
	}
	
	if (schema.custom) return validateCustom(obj, schema, callback, keyPath);
	if ('Object' == schema.type.name) return validateObject(obj, schema, callback, keyPath);
	if ('Array' == schema.type.name) return validateArray(obj, schema, callback, keyPath);
	if ('String' == schema.type.name) return validateString(obj, schema, callback, keyPath);
	if ('Number' == schema.type.name) return validateNumber(obj, schema, callback, keyPath);
	if ('Boolean' == schema.type.name) return validateBoolean(obj, schema, callback, keyPath);
	if ('Date' == schema.type.name) return validateDate(obj, schema, callback, keyPath);
	
	throw new Error('Cannot validate schema of type ' + schema.type.name + '.');
	
};

module.exports = function(obj, schema, callback, keyPath) {
	
	if (!schema) throw new Error('Missing parameter schema');
	if (!callback) throw new Error('Missing parameter callback');
	
	keyPath = keyPath || [];
	
	return validateAny(obj, schema, callback, keyPath);
		
};
