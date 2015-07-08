var objectAssign = require('object-assign'),
    SchemaError = require('./errors/schemaError.js');

var finalize = function(formalizedSchema, nonFormalizedSchema, fn) {

	// Add the old non-formalized schema - for preventing
	// redundant formalization and for usage by the
	// validator when sending validation errors.
	//
	// Make the property unenumerable.
	Object.defineProperty(formalizedSchema, '_nonFormalizedSchema', {
		value: nonFormalizedSchema,
		enumerable: false,
	});

	// We seal the schema so no futher editing can take place.
	Object.seal(formalizedSchema);

	// Call back on next tick.
	if (fn) process.nextTick(function() {
		fn(formalizedSchema);
	});

};

var formalizeObject = function(formalizedSchema, nonFormalizedSchema, fn) {

	// formalizedSchema has been pre-processed by formalizeAny, so
	// we only need to formalize the sub-schema.

	// Set an empty sub-schema if schema is not present.
	formalizedSchema.schema = formalizedSchema.schema || {};

	// Build new formalized schema into this.
	var formalizedSubschema = {};

	var keys = Object.keys(formalizedSchema.schema);

	(function formalizeNextKey(idx) {

		// If idx equals keys length - we are done.
		if (idx == keys.length) {
			formalizedSchema.schema = formalizedSubschema;
			return finalize(formalizedSchema, nonFormalizedSchema, fn);
		}

		var key = keys[idx];

		formalizeAny(formalizedSchema.schema[key], function(formalizedKey) {

			// Apply implicit required if sub-schema is required.
			if (formalizedSchema.required === undefined || formalizedSchema.required == 'implicit') {
				if (formalizedKey.required === true) formalizedSchema.required = true;
			}

			formalizedSubschema[key] = formalizedKey;

			process.nextTick(function() {
				formalizeNextKey(idx + 1);
			});

		});

	})(0);

};

var formalizeArray = function(formalizedSchema, nonFormalizedSchema, fn) {

	// formalizedSchema has been pre-processed by formalizeAny, so
	// we only need to formalize the sub-schema.

	formalizeAny(formalizedSchema.schema, function(formalizedSubschema) {

		formalizedSchema.schema = formalizedSubschema;

		// Apply implicit required if sub-schema has required data.
		if (typeof(formalizedSchema.required) === 'undefined' || formalizedSchema.required === 'implicit') {
			if (formalizedSchema.schema.required === true) formalizedSchema.required = true;
		}

		if (fn) return finalize(formalizedSchema, nonFormalizedSchema, fn);

	});

};

var formalizeAny = function(schema, fn) {

	// If schema is already formalized we just call back.
	if (schema._nonFormalizedSchema !== undefined) return fn(schema);

	if (!schema.type && !schema.custom) {
		if ('Object' == schema.constructor.name) {
			return formalizeObject({ type: Object, schema: schema }, schema, fn);
		}
		if ('Array' == schema.constructor.name) {
			if (schema.length == 0) throw new SchemaError(schema, 'Array must have exactly one schema.');
			return formalizeArray({ type: Array, schema: schema[0] }, schema, fn);
		}
    throw new SchemaError(schema, 'Schema must be type Object or Array.');
	}

	var formalizedSchema = formalizedSchema || {};

	var validators = {};

  // Ensure type is supported.
  if (typeof schema.type !== 'undefined' && [ 'Object', 'Array', 'String', 'Number', 'Boolean', 'Date' ].indexOf(schema.type.name) == -1) {
    throw new SchemaError(schema, 'Cannot validate schema of type ' + schema.type.name + '.');
  }

  var common = {
    'type': ['Function'],
    'required': ['Boolean', 'String'],
    'default': true,
    'allowNull': ['Boolean'],
    'errors': [ 'Object' ],
    'custom': [ 'Function' ]
  };
  var typeSpecific = {};

  if (schema.type !== undefined) {
    if ('Object' == schema.type.name) typeSpecific = {
      'schema': [ 'Object' ],
      'allowUnknownKeys': [ 'Boolean' ]
    };
    if ('Array' == schema.type.name) typeSpecific = {
      'schema': ['Object'],
      'len': [ 'String', 'Number' ],
      'unique': [ 'Boolean' ]
    }
    if ('String' == schema.type.name) typeSpecific = {
      'match': [ 'RegExp' ],
      'trim': [ 'Boolean' ],
      'enum': [ 'Array' ]
    }
    if ('Number' == schema.type.name) typeSpecific = {
      'range': [ 'String', 'Number' ]
    }
  }

  // If custom validator is provided allow for options.
  if (typeof schema.custom == 'function') {
    common.options = true;
  }

  validators = objectAssign(common, typeSpecific);

	// Copy validators to formalizedSchema - checking
	// for non-supported validators at the same time.
	for (var key in schema) {
		if (validators[key] === undefined) throw new SchemaError(
			schema,
			'Validator \'' + key + '\' is unknown in this context.'
		);

		if (validators[key] !== true && validators[key].indexOf(schema[key].constructor.name) == -1) {
			throw new SchemaError(
				schema,
				'Validator \'' + key + '\' must be of type(s) ' + validators[key].join(', ') + '.'
			);
		}

		formalizedSchema[key] = schema[key];
	}

  if (typeof formalizedSchema.required === 'string' && formalizedSchema.required != 'implicit') {
    throw new SchemaError(
      schema,
      'Validator \'required\' must be a Boolean or String of value \'implicit\''
    );
  }

  // Check string enums
  if (typeof formalizedSchema.enum !== 'undefined') {
    if (formalizedSchema.enum.length < 1) {
      throw new SchemaError(
        schema,
        'Validator \'' + key + '\': enums must have at least one item.'
      );
    }
    for (var idx in formalizedSchema.enum) {
      if (typeof formalizedSchema.enum[idx] !== 'string') {
        throw new SchemaError(
          schema,
          'Validator \'' + key + '\': enums must be an array of strings.'
        );
      }
    }
  }

	// Finalize objects and arrays if necessary.
	if (formalizedSchema.type) {
		if ('Object' == formalizedSchema.type.name) return formalizeObject(schema, formalizedSchema, fn);
		if ('Array' == formalizedSchema.type.name) return formalizeArray(schema, formalizedSchema, fn);
	}

	return finalize(formalizedSchema, schema, fn);

};

module.exports.formalize = formalizeAny;
