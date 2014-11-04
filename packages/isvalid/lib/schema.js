var checkValidators = function(schema) {
	
	var validators = [];
	
	if (schema.custom) validators = [ 'custom', 'options' ];
	if (schema.type) {
		validators = [ 'type', 'required', 'default', 'errors' ];
		if ('Object' == schema.type.name) validators = validators.concat([ 'schema', 'allowUnknownKeys' ]);
		if ('Array' == schema.type.name) validators = validators.concat([ 'schema', 'len', 'unique' ]);
		if ('String' == schema.type.name) validators = validators.concat([ 'match', 'trim' ]);
		if ('Number' == schema.type.name) validators = validators.concat([ 'range' ]);
	}
	
	for (var key in schema) {
		if (validators.indexOf(key) == -1) throw new Error('Validator \'' + key + '\' is unknown in this context.');
	}
	
};

var finalize = function(schema, fn) {
	
	// We mark the schema as formalized. This way we only do things once.
	// Also the validator is able to formalize schemas on demand,
	// instead - as of with the old version - formalizing the entire
	// schema before validation.
	
	schema._formalized = true;
	
	// Set the property read-only and unenumerable.
	Object.defineProperty(schema, '_formalized', {
		enumerable: false,
		writable: false
	});
	
	if (fn) return process.nextTick(function() {
		return fn(schema);
	})
	
};

var formalizeObject = function(schema, fn) {
	
	(function formalizeNextKey(fn, formalizedSchema) {
		
		formalizedSchema = formalizedSchema || {};
		
		for (var key in schema.schema) break;
		if (key === undefined) return fn(formalizedSchema);
				
		formalizeAny(schema.schema[key], function(formalizedKeySchema) {
			delete schema.schema[key];
			formalizedSchema[key] = formalizedKeySchema;
			formalizeNextKey(fn, formalizedSchema);
		});
		
	})(function(formalizedSchema) {
		
		schema.schema = formalizedSchema;
		
		// Resolve any 'implicit' require
		// Because the subschema keys are already formalized (above) this works nestedly.
		if (typeof(schema.required) === 'undefined' || schema.required === 'implicit') {
			for (var key in schema.schema) {
				if (schema.schema[key].required === true) {
					schema.required = true;
					break;
				}
			}
		}
		
		if (fn) return finalize(schema, fn);
		
	});
		
};

var formalizeArray = function(schema, fn) {
	
	formalizeAny(schema.schema, function(formalizedSchema) {
		
		schema.schema = formalizedSchema;
		
		if (typeof(schema.required) === 'undefined' || schema.required === 'implicit') {
			if (schema.schema.required === true) schema.required = true;
		}
		
		if (fn) return finalize(schema, fn);
		
	});
	
};

var formalizeAny = function(schema, fn) {
	
	// If schema is already formalized we just callback immediately.
	if (schema._formalized === true) return fn(schema);
	
	// Type Shortcuts
	if (!schema.type && !schema.custom) {
		if ('Object' == schema.constructor.name) return formalizeObject({ type: Object, schema: schema }, fn);
		if ('Array' == schema.constructor.name) {
			if (schema.length == 0) throw new Error('Array shortcut must contain a schema object.');
			return formalizeArray({ type: Array, schema: schema[0] }, fn);
		}
	}
	
	checkValidators(schema);
	
	if (!schema.custom) {
		if ('Object' == schema.type.name) return formalizeObject(schema, fn);
		if ('Array' == schema.type.name) return formalizeArray(schema, fn);
	}
	
	if (fn) return finalize(schema, fn);
		
};

module.exports.formalize = formalizeAny;
