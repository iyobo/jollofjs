/* Validation middleware for routes. */

var Error = require('../utils/errors');

var validate = function(obj, schema, callback, fieldName) {
	
	if (!schema)
		throw new Error.Validation('No schema supplied for validation.');
	fieldName = fieldName || 'obj';
	
	/* Type shortcuts. */
	if ('Object' == schema.constructor.name && schema.type === undefined)
		schema = { type: Object, schema: schema };
	else if ('Array' == schema.constructor.name)
		schema = { type: Array, schema: schema[0] };
	else if ('Function' == schema.constructor.name)
		schema = { type: schema };
	
	if (obj === undefined) {
		
		if (schema.default)
			callback(null, schema.default);
		else if (schema.required)
			callback(new Error.Validation('Required key ' + fieldName + ' not set.'));
		else
			callback(null, obj);
		
	} else {
		
		if ('Object' == schema.type.name) { /* Validate type Object. */
			
			if (obj === null)
				callback(null, null);
			else if ('Object' != obj.constructor.name) /* Enforce obj type. */
				callback(new Error.Validation('Key ' + fieldName + ' is not of type Object.'));
			else {
				
				/* Find unknown keys. */
				for (var key in obj)
					if (!schema.schema[key]) {
						callback(new Error.Validation('Unknown key ' + fieldName + '.' + key + '.'));
						return;
					}
				
				/* Copy schema. */
				var schemaCopy = {};
				for (var key in schema.schema)
					schemaCopy[key] = schema.schema[key];
				
				/* Validate obj and build validated object (validObj). */
				var validatedObj = {};
				
				(function validateKey() {
					for (var key in schemaCopy) break; /* Get first key. */
					if (key !== undefined) {
						validate(obj[key], schemaCopy[key], function(err, val) {
							if (!err) {
								delete schemaCopy[key];
								if (val !== undefined)
									validatedObj[key] = val;
								validateKey();
							} else
								callback(err);
						}, fieldName + '.' + key);
					} else
						callback(null, validatedObj);
				})();
				
			}
			
		} else if ('Array' == schema.type.name) { /* Validate type Array. */
			
			if (obj === null)
				callback(null, null);
			else if ('Array' != obj.constructor.name) /* Enforce obj type. */
				callback(new Error.Validation('Key ' + fieldName + ' is not of type Array.'));
			else {
				
				/* Enforce range option. */
				if (schema.len && 'String' == schema.len.constructor.name) {
					
					var lengthValid = false;
					var ranges = schema.len.replace(/[ ]+/, '').split(',');
					for (var index in ranges) {
						var range = ranges[index].split('-');
						if (range.length == 1 && obj.length == parseInt(range[0])) {
							lengthValid = true;
							continue;
						} else if (range.length == 2) {
							range[0] = (range[0].length == 0 ? 0 : parseInt(range[0]));
							range[1] = (range[1].length == 0 ? Infinity : parseInt(range[1]));
							if (obj.length >= range[0] && obj.length <= range[1]) {
								lengthValid = true;
								continue;
							}
						}
					}
					
					if (!lengthValid) {
						callback(new Error.Validation('Key ' + fieldName + ' length is not within the range(s) ' + schema.len + '.'));
						return;
					}
					
				} else if (schema.len && 'Number' == schema.len.constructor.name && obj.length != schema.len) {
					callback(new Error.Validation('Key ' + fieldName + ' array does not hold ' + schema.len + ' items.'));
					return;
				}

				var validatedArr = [];
				var index = 0;

				(function validateIndex() {
					
					if (index < obj.length) {
						
						validate(obj[index], schema.schema, function(err, val) {
							if (!err) {
								if (val !== undefined)
									validatedArr.push(val);
								index++;
								validateIndex();
							} else
								callback(err);
						}, fieldName + '.' + index);
						
					} else {
						
						if (schema.unique) {
							
							for (var a = 1 ; a < validatedArr.length ; a++)
								for (var b = 0 ; b < a ; b++)
									if (('Boolean' == schema.unique.constructor.type && validatedArr[a] == validatedArr[b])
										|| ('String' == schema.unique.constructor.name && validatedArr[a][schema.unique] == validatedArr[b][schema.unique])) {
										callback(new Error.Validation('Index ' + b + ' and ' + a + ' are non-unique in key ' + fieldName + '.'));
										return;
									}
							
						}
						
						callback(null, validatedArr);
						
					}
					
				})();
								
			}
			
		} else if ('String' == schema.type.name) { /* Validate type String */
			
			if (obj === null && !schema.match)
				callback(null, null)
			else if (obj === null)
				callback(new Error.Validation('Key ' + fieldName + ' does not match expression ' + schema.match.source + '.'));
			else if ('String' != obj.constructor.name) /* Enforce obj type */
				callback(new Error.Validation('Key ' + fieldName + ' is not of type String.'));
			else {
				
				var validStr = obj;
				
				if (schema.trim)
					validStr = validStr.replace(/^\s+|\s+$/g,'');
				
				if (schema.match && !schema.match.test(obj)) {
					callback(new Error.Validation('Key ' + fieldName + ' does not match expression ' + schema.match.source + '.' ));
					return;
				}
				
				callback(null, validStr);
				
			}
			
		} else if ('Number' == schema.type.name) {
			
			if (obj === null)
				callback(null, null);
			else {
				
				if ('Number' == obj.constructor.name)
					callback(null, obj);
				else if ('String' == obj.constructor.name) {

					var match = obj.match(/[0-9]+(?:\.[0.9])?/);
					if (match && match[0].length == obj.length) {
						callback(null, parseFloat(obj));
						return;
					}

				}
				
				callback(new Error.Validation('Key ' + fieldName + ' is not a number.'));
				
			}
			
		} else if ('Boolean' == schema.type.name) {
			
			if (obj === null || 'Boolean' == obj.constructor.name)
				callback(null, obj);
			else if ('String' == obj.constructor.name && (obj.toLowerCase() == 'true' || obj.toLowerCase() == 'false'))
				callback(null, (obj.toLowerCase() == 'true'));
			else
				callback(new Error.Validation(fieldName + ' is not a boolean.'));
			
		} else {
			
			if (obj.constructor.name != schema.type.name)
				callback(new Error.Validation('Key ' + fieldName + ' is not a ' + schema.type.name + '.'));
			else
				callback(null, obj);
			
		}
		
	}
	
};

module.exports = {
	
	validate: validate,	
	validateBody: function(schema) {
		
		return function(req, res, next) {
			validate(req.body, schema, function(err, validObj) {
				req.body = validObj;
				next(err);
			}, 'body');
		};
		
	},
	validateQuery: function(schema) {
		
		return function(req, res, next) {
			validate(req.query, schema, function(err, validObj) {
				req.query = validObj;
				next(err);
			}, 'query');
		};
		
	}
	
};
