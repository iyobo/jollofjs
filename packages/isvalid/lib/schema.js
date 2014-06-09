var formalizeObject = function(schema) {
	
	for (var key in schema.schema) {
		schema.schema[key] = formalize(schema.schema[key]);
	}
	
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
		
	return schema;
	
};

var formalizeArray = function(schema) {
	
	schema.schema = formalize(schema.schema);
	
	if (typeof(schema.required) === 'undefined' || schema.required === 'implicit') {
		if (schema.schema.required === true) schema.required = true;
	}
	
	return schema;
	
};

var formalize = function(schema) {
	
	// Type Shortcuts
	if (!schema.type && !schema.custom) {
		if ('Object' == schema.constructor.name) return formalize({ type: Object, schema: schema });
		if ('Array' == schema.constructor.name) {
			if (schema.length == 0) throw new Error('Array shortcut must contain a schema object.');
			return formalize({ type: Array, schema: schema[0] });
		}
	}
		
	if ('Object' == schema.type.name) return formalizeObject(schema);
	if ('Array' == schema.type.name) return formalizeArray(schema);
	
	return schema;
	
};

module.exports.formalize = formalize;
