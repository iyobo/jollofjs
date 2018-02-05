'use strict';

var merge = require('merge'),
    SchemaError = require('./errors/SchemaError.js');

var supportedTypes = ['Object', 'Array', 'String', 'Number', 'Boolean', 'Date'];

var finalize = function (formalizedSchema, nonFormalizedSchema, fn, sync) {

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
    //Object.seal(formalizedSchema); //Remove seal as we need to make changes to this.

    // Allow for I/O if running async.
    if (fn) {
        if (sync) return fn(formalizedSchema, true);
        else setImmediate(fn, formalizedSchema, true);
    }

};

var formalizeObject = function (formalizedSchema, nonFormalizedSchema, fn, sync) {

    // For backwards compatibility be before version 1.0.3
    // we change the allowUnknownKeys to unknownKeys
    if (typeof formalizedSchema.allowUnknownKeys === 'boolean') {
        if (!process.env.ISVALID_SILENCE) {
            console.error('isvalid: DEPRECATED: Validator allowUnknownKeys has been deprecated in favour of unknownKeys as of version 1.0.4. See README for more info.');
        }
        formalizedSchema.unknownKeys = (formalizedSchema.allowUnknownKeys ? 'allow' : 'remove'); //Don't throw an error. either allow, or remove.
        formalizedSchema.wasAllowUnknownKeys = true;
        delete formalizedSchema.allowUnknownKeys;
    }

    // If no sub-schema is provided we consider the schema final.
    if (typeof formalizedSchema.schema === 'undefined') return finalize(formalizedSchema, nonFormalizedSchema, fn, sync);
    if (formalizedSchema.schema.constructor.name !== 'Object') throw new SchemaError(formalizedSchema.schema, 'Object schemas must be an object.');

    // Build new formalized schema into this.
    var formalizedSubschema = {};

    var keys = Object.keys(formalizedSchema.schema);

    (function formalizeNextKey(idx) {

        // If idx equals keys length - we are done.
        if (idx == keys.length) {
            formalizedSchema.schema = formalizedSubschema;
            formalizedSchema = finalize(formalizedSchema, nonFormalizedSchema, fn, sync);
            return;
        }

        var key = keys[idx];

        formalizeAny(formalizedSchema.schema[key], function (formalizedKey) {

            // Apply implicit required if sub-schema is required.
            if (formalizedSchema.required === undefined || formalizedSchema.required == 'implicit') {
                if (formalizedKey.required === true) formalizedSchema.required = true;
            }

            formalizedSubschema[key] = formalizedKey;

            if (sync) return formalizeNextKey(idx + 1);
            else setImmediate(formalizeNextKey, idx + 1);

        }, sync);

    })(0);

    return formalizedSchema;

};

var formalizeArray = function (formalizedSchema, nonFormalizedSchema, fn, sync) {

    // formalizedSchema has been pre-processed by formalizeAny, so
    // we only need to formalize the sub-schema.

    // If no sub-schema is provided we consider the schema final.
    if (typeof formalizedSchema.schema === 'undefined') return finalize(formalizedSchema, nonFormalizedSchema, fn, sync);

    return formalizeAny(formalizedSchema.schema, function (formalizedSubschema) {

        formalizedSchema.schema = formalizedSubschema;

        // Apply implicit required if sub-schema has required data.
        if (typeof(formalizedSchema.required) === 'undefined' || formalizedSchema.required === 'implicit') {
            if (formalizedSchema.schema.required === true) formalizedSchema.required = true;
        }

        return finalize(formalizedSchema, nonFormalizedSchema, fn, sync);

    }, sync);

};

/**
 * Converts shortcuts to full form.
 * Also populates 'meta' field with field type.
 *
 * @param schema
 * @param fn
 * @param sync
 * @returns {*}
 */
var formalizeAny = function (schema, fn, sync) {

    // If no fn we operate sync.
    if (fn === undefined) {
        fn = function (s) {
            return s;
        };
        sync = true;
    }

    // If schema is already formalized we just call back.
    if (typeof schema._nonFormalizedSchema !== 'undefined')
    	return fn(schema, false);

    if (!schema.type && !schema.custom) {
        if ('Object' == schema.constructor.name) {
            return formalizeObject({
                type: Object,
                schema: schema,
                meta: { type: schema.constructor.name },
				unknownKeys: 'remove'
            }, schema, fn, sync);
        }
        if ('Array' == schema.constructor.name) {
            if (schema.length === 0) throw new SchemaError(schema, 'Array must have exactly one schema.');
            return formalizeArray({
                type: Array,
                schema: schema[0],
                meta: { type: schema.constructor.name }
            }, schema, fn, sync);
        }
        if (typeof schema === 'function' && supportedTypes.indexOf(schema.name) > -1) {
            return formalizeAny({ type: schema, meta: { type: schema.name } }, fn, sync);
        }
        throw new SchemaError(schema, 'Schemas must have validators `type` and/or `custom`.');
    }


    // Copy schema.
    var formalizedSchema = merge(true, schema);

    // Validators common to all types.
    var validators = {
        'type': ['Function'],
        'required': ['Boolean', 'String'],
        'default': 'Any',
        'allowNull': ['Boolean'],
        'errors': ['Object'],
        'custom': ['Function', 'Array'],
        'meta': 'Any'
    };

    // Validators specific to type.
    if (formalizedSchema.type !== undefined) {
        if ('Object' == formalizedSchema.type.name) merge(validators, {
            'schema': 'Any',
            'allowUnknownKeys': ['Boolean'], // Deprecated as of version 1.0.4
            'unknownKeys': ['String']
        });
        if ('Array' == formalizedSchema.type.name) merge(validators, {
            'schema': 'Any',
            'len': ['String', 'Number'],
            'unique': ['Boolean'],
            'autowrap': ['Boolean', 'String']
        });
        if ('String' == formalizedSchema.type.name) merge(validators, {
            'match': ['RegExp'],
            'trim': ['Boolean'],
            'enum': ['Array'],
            'range': ['String', 'Number']
        });
        if ('Number' == formalizedSchema.type.name) merge(validators, {
            'range': ['String', 'Number']
        });
    }

    // If custom validator is provided allow for options.
    if (formalizedSchema.custom !== undefined) {
        merge(validators, { 'options': 'Any' });
    }

    // Copy validators to formalizedSchema - checking
    // for non-supported validators at the same time.
    for (var key in formalizedSchema) {

        var validator = validators[key];

        if (validator === undefined) throw new SchemaError(
            schema,
            'Validator \'' + key + '\' is unknown in this context.'
        );

        var test = formalizedSchema[key];

        // Test for - and transform - errors in validator.
        if (test.constructor.name === 'Array' &&
            test.length === 2 &&
            (validator === 'Any' || validator.indexOf(test[0].constructor.name) > -1) &&
            test[1].constructor.name === 'String') {

            formalizedSchema.errors = formalizedSchema.errors || {};
            formalizedSchema.errors[key] = test[1];
            formalizedSchema[key] = test = test[0];

        }

        // Ensure validator is of correct type.
        if (validator !== 'Any' && validator.indexOf(test.constructor.name) == -1) {
            throw new SchemaError(
                schema,
                'Validator \'' + key + '\' must be of type(s) ' + validators[key].join(', ') + '.'
            );
        }

    }

    // Check for supported type.
    if (typeof formalizedSchema.type !== 'undefined' && supportedTypes.indexOf(formalizedSchema.type.name) == -1) {
        throw new SchemaError(formalizedSchema, 'Cannot validate schema of type ' + formalizedSchema.type.name + '.');
    }

    // Convert custom function to array
    if (typeof formalizedSchema.custom === 'function') {
        formalizedSchema.custom = [formalizedSchema.custom];
    }

    // Throw error if required is invalid value
    if (typeof formalizedSchema.required === 'string' && formalizedSchema.required != 'implicit') {
        throw new SchemaError(
            schema,
            'Validator \'required\' must be a Boolean or String of value \'implicit\'.'
        );
    }

    // Check object unknownKeys
    if (typeof formalizedSchema.unknownKeys === 'string' &&
        ['allow', 'deny', 'remove'].indexOf(formalizedSchema.unknownKeys) == -1) {
        throw new SchemaError(
            schema,
            'Validator \'unknownKeys\' must have value \'allow\', \'deny\' or \'remove\'.'
        );
    }

    // Check string enums
    if (typeof formalizedSchema.enum !== 'undefined') {
        if (formalizedSchema.enum.length < 1) {
            throw new SchemaError(
                schema,
                'Validator \'enum\' must have at least one item.'
            );
        }
        for (var idx in formalizedSchema.enum) {
            if (typeof formalizedSchema.enum[idx] !== 'string') {
                throw new SchemaError(
                    schema,
                    'Validator \'enum\' must be an array of strings.'
                );
            }
        }
    }

    // Check autowrap.
    if (typeof formalizedSchema.autowrap === 'string' && formalizedSchema.autowrap !== 'transparent') {
        throw new SchemaError(
            schema,
            'Validator \'autowrap\' must have value `true`, `false` or `transparent`.'
        );
    }

    // Finalize objects and arrays if necessary.
    if (formalizedSchema.type) {
        if ('Object' == formalizedSchema.type.name) return formalizeObject(formalizedSchema, schema, fn, sync);
        if ('Array' == formalizedSchema.type.name) return formalizeArray(formalizedSchema, schema, fn, sync);
    }

    return finalize(formalizedSchema, schema, fn, sync);

};

exports.formalize = module.exports.formalize = formalizeAny;
