var ValidationError = require('./error.js'),
	ranges = require('./ranges.js'),
	unique = require('./unique.js'),
	schemaTools = require('./schema.js');

var finalize = function(obj, fn) {
	
	if (fn) return process.nextTick(function() {
		fn(null, obj);
	});
	
};

var validateObject = function(obj, schema, fn, keyPath) {
	
	if (obj) {
		
		if ('Object' != obj.constructor.name) {
			return fn(
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
					return fn(
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
			if (!key) return finalize(validObj, fn);
		
			var keySchema = schemaCopy[key];
			delete schemaCopy[key];
			
			validateAny(obj[key], keySchema, function(err, validatedObj) {
				if (err) return fn(err);
				validObj[key] = validatedObj;
				validateNextKey();
			}, keyPath.concat([key]));
			
		};
		
		return validateNextKey();
		
	}
	
	return finalize(obj, fn);
	
};

var validateArray = function(arr, schema, fn, keyPath) {
	
	if (arr) {
		
		var validArray = [];
		
		var validateNext = function(idx) {
			
			if (idx == arr.length) {
				
				if (schema.len && !ranges.testIndex(schema.len, validArray.length)) {
					return fn(
						new ValidationError(
							keyPath,
							schema,
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
								schema,
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
			}, keyPath.concat([ idx.toString() ]));
			
		};
		
		return validateNext(0);
				
	}
	
	return finalize(arr, fn);
	
};

var validateString = function(str, schema, fn, keyPath) {
	
	if (str) {
		
		var validStr = str;
	
		if ('String' != validStr.constructor.name) {
			return fn(
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
				return fn(
					new ValidationError(
						keyPath,
						schema,
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

var validateNumber = function(num, schema, fn, keyPath) {
	
	if (num) {
		
		var validNum = num;
	
		if ('String' == validNum.constructor.name && /^[0-9]+(?:\.[0.9])?$/.test(num)) {
			validNum = parseFloat(validNum);
		} else if ('Number' != validNum.constructor.name) {
			return fn(
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
				return fn(
					new ValidationError(
						keyPath,
						schema,
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

var validateBoolean = function(val, schema, fn, keyPath) {
	
	if (val) {
		
		if ('String' == val.constructor.name && /^true|false$/i.test(val)) {
			val = /^true$/i.test(val);
		}
		
		if ('Boolean' != val.constructor.name) {
			return fn(
				new ValidationError(
					keyPath,
					schema,
					'type',
					(schema.errors || {}).type || 'Is not of type boolean.'
				)
			);
		}
		
		return finalize(val, fn);
		
	}
	
	return finalize(val, fn);
	
};

var validateDate = function(val, schema, fn, keyPath) {
	
	if (val) {
		
		if ('String' == val.constructor.name ) {
			var date = new Date(val);
			if ( ! isNaN(date.getDate()) )
	 			return finalize(date, fn);

			return fn(
				new ValidationError(
					keyPath,
					schema,
					'type',
					(schema.errors || {}).type || 'Is not a valid Date string.'
				)
			);
		}

		if ('Date' != val.constructor.name) {
			return fn(
				new ValidationError(
					keyPath,
					schema,
					'type',
					(schema.errors || {}).type || 'Is not coerceable to a Date.'
				)
			);
		}
		
		return finalize(val, fn);
		
	}
	
	return finalize(val, fn);
	
};

var validateCustom = function(obj, schema, fn, keyPath) {
	
	return schema.custom(obj, schema, function(err, validObj) {
		if (err) {
			var stack = err.stack;
			err = new ValidationError(keyPath, schema, 'custom', err.message);
			err.stack = stack;
		}
		return fn(err, validObj);
	});
	
};

var validateAny = function(obj, schema, fn, keyPath) {
	
	// If schema is not yet formalized - formalize it and come back.
	if (schema._formalized !== true) {
		return schemaTools.formalize(schema, function(formalizedSchema) {
			return validateAny(obj, formalizedSchema, fn, keyPath);
		});
	}
	
	if (!obj) {
		if (schema.default) {
			if ('Function' == schema.default.constructor.name) {
				return schema.default(function(defaultValue) {
					finalize(defaultValue, fn);
				});
			} else {
				return finalize(schema.default, fn);
			}
		}
		if (schema.required) {
			return fn(
				new ValidationError(
					keyPath,
					schema,
					'required',
					 (schema.errors || {}).required || 'Key is required.'
				 )
			 );
		}
	}
	
	if (schema.custom) return validateCustom(obj, schema, fn, keyPath);
	if ('Object' == schema.type.name) return validateObject(obj, schema, fn, keyPath);
	if ('Array' == schema.type.name) return validateArray(obj, schema, fn, keyPath);
	if ('String' == schema.type.name) return validateString(obj, schema, fn, keyPath);
	if ('Number' == schema.type.name) return validateNumber(obj, schema, fn, keyPath);
	if ('Boolean' == schema.type.name) return validateBoolean(obj, schema, fn, keyPath);
	if ('Date' == schema.type.name) return validateDate(obj, schema, fn, keyPath);
	
	throw new Error('Cannot validate schema of type ' + schema.type.name + '.');
	
};

module.exports = function(obj, schema, fn, keyPath) {
	
	if (!schema) throw new Error('Missing parameter schema');
	if (!fn) throw new Error('Missing parameter fn');
	
	keyPath = keyPath || [];
	
	return validateAny(obj, schema, fn, keyPath);
		
};
