# isvalid

[![npm version](https://badge.fury.io/js/isvalid.svg)](https://www.npmjs.com/package/isvalid) [![travis ci](https://travis-ci.org/trenskow/isvalid.svg?branch=master)](https://travis-ci.org/trenskow/isvalid)
-

**isvalid** is an asynchronous node.js library for validating and error correcting JSON. In contrary to JSON Schema it uses a very simple schema model - inspired by the Mongoose schemas.

# What's New?

## In Version 0.3.0

* Bug fixes.
* `type` and `custom` can now be used alongside each other.
* Migrated Connect/Express middleware to this package from *invalid-express*.

## In Version 0.2.0

* It now catches more errors in schemas - such as wrong values on validators.
* Schema errors are now thrown as a `SchemaError` which contains schema that failed through the `schema` property.
* The library is now completely asynchronous - allowing for I/O while formalizing, validating and comparing.
* Formalizer is publicly exposed in order to pre-formalize schemas manually.
* Schemas are now formalized per demand. Large schemas are formalized by the validator as they are needed.
* ValidationErrors now contain the pre-formalized schema - for better identification by developer.

## In Version 0.1.0

 * Automatic parsing of [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) dates into Date - contributed by [thom-nic](https://github.com/thom-nic).
 * Errors are thrown if validators are used out of context.
 * ValidationError now contains the `validator` property - specifying which validator actually failed.
 * You can now specify custom error messages using the `error` validator.
 * `Object` now supports the `allowUnknownKeys` validator.

# Table of Content

   * [How to Use](#how-to-use)
     * [Example](#example)
     * [As Connect or Express Middleware](#as-connect-or-express-middleware)
       * [Example](#example-1)
   * [How it Works](#how-it-works)
     * [Errors](#errors)
       * [SchemaError](#schemaerror)
       * [ValidationError](#validationerror)
     * [Type Shortcuts](#type-shortcuts)
       * [Object Shortcuts](#object-shortcuts)
       * [Array Shortcuts](#array-shortcuts)
     * [Supported Types](#supported-types)
       * [Common Validators](#common-validators)
         * [`default` Validator](#default-validator)
           * [Static Values](#static-values)
           * [Functions](#functions)
         * [`required` Validator](#required-validator)
           * [Implicitly Required](#implicitly-required)
         * [`errors` Validator](#errors-validator)
       * [Type Specific Validators](#type-specific-validators)
         * [Validators Common to Objects and Arrays](#validators-common-to-objects-and-arrays)
           * [`schema` Validator](#schema-validator)
         * [Object Validators](#object-validators)
           * [`allowUnknownKeys` Validator](#allowunknownkeys-validator)
         * [Array Validators](#array-validators)
           * [`len` Validator](#len-validator)
           * [`unique` Validator](#unique-validator)
         * [String Validators](#string-validators)
           * [`trim` Validator](#trim-validator)
           * [`match` Validator](#match-validator)
         * [Number Validators](#number-validators)
           * [`range` Validator](#range-validator)
     * [Custom Validators](#custom-validators)
       * [Example](#example-2)
       * [The Callback Function](#the-callback-function)
       * [Options with Custom Validators](#options-in-custom-validators)
     * [Automatic Type Conversion](#automatic-type-conversion)
       * [Numbers](#numbers)
       * [Booleans](#booleans)
       * [Dates](#dates)
     * [Be aware of...](#be-aware-of)
       * [Object Shortcuts](#object-shortcuts-1)
   * [License](#license)

# How to Use

**isvalid** uses a simple schema modal to specify how the data should be formatted. It supports generic validators for all types and type specific validators.

Usage: `isvalid(dataToValidate, validationSchema, callback)`

## Example

Here's a simple example on how to use the validator:

    var isvalid = require('isvalid');

    isvalid(somedata, {
        'user': { type: String, required: true },
        'pass': { type: String, required: true }
    }, function(err, validObj) {
    	/*
    	err:      Error describing invalid data.
    	validObj: The validated data.
    	*/
    });

## As Connect or Express Middleware

Connect and express middleware is build in.

Usage: `isvalid.validate.body(schema)` or `isvalid.validate.query(schema)`.

### Example

    var validate = require('isvalid').validate;
    
    app.post('/mypath',
    validate.query({
        'filter': { type: String }
    }),
    validate.body({
        'mykey': { type: String, required: true }
    }),
    function(req, res) {
        // req.body and req.query is now validated.
        // - any default values - or type conversion - has been applied!
    });

# How it Works

**isvalid** is a comprehensive validation library - build for ease of use. Both as Connect or Express middleware - where it comes in really handy - or as stand alone.

## Errors

Errors in function parameters or schemas are thrown - as they are developer errors - and validation errors are passed to the
callback.

* Wrong parameters throw `Error` instances.
* Schema errors throw `SchemaError` instances.
* Validation errors are passed to the callback as `ValidationError` instances.

### SchemaError

The `SchemaError` contains the `schema` property which contains the actual schema in which there is an error. It also has a `message` property with a description of the error.

### ValidationError

The `ValidationError` contains three properties besides the `message` field of `Error`.

  - `keyPath` is an array indicating the key path in the data where the error occured.
  - `schema` is the schema that failed to validate.
  - `validator` is the name of the validator that failed.

## Type Shortcuts

Some types can be specified using shortcuts. Instead of specifying the type, you just use the type. This works with objects and arrays.

In the above simple example we used the object shortcut and should have looked like this if we hadn't.

    isvalid(somedata, {
        type: Object,
        schema: {
            'user': { type: String, required: true },
            'pass': { type: String, required: true }
        }
    }, ...);

### Object Shortcuts

Object shortcuts are used like this:

    {
        "user": { type: String }
    }

and is in fact the same as this:

    {
        type: Object,
        schema: {
        	"user": { type: String }
        }
    }

Which means that data should be an object with a `user` field of the type `String`.

### Array Shortcuts

The same goes for arrays:

    [
        { type: String }
    ]

is essentially the same as:

    {
        type: Array,
        schema: { type: String }
    }

Which means the data must be an array of strings.

## Supported Types

These types are supported by the validator:

 * Object
 * Array
 * String
 * Number
 * Boolean
 * Date
 * or custom validators.

There are some validators that are common to all types, and some types have specific validators.

You specify the type like this:

    { type: String }

In the above example the input must be of type `String`.

All schemas must have the `type` specified or have a custom validator through a `custom` function - more about custom validators in it's designated section below.

> Object and array shortcuts apply their type automatically - as seen above.

### Common Validators

These validators are supported by all types.

#### `default` Validator
Defaults data to specific value if data is not present in input. It takes a specific value or it can call a custom function to retrieve the value.

Type: Any value or a function.

##### Static Values

Example:

    {
        "email": { type: String, default: "email@not.set" }
    }

This tells the validator, that an `email` field is expected, and if it is not found, it should just assign it with whatever is specified using default.

This works with all supported types - below with a boolean type:

    {
        "receive-newsletter": { type: Boolean, default: false }
    }

Now if the `receive-newsletter` field is absent in the data the validator will default it to `false`.

##### Functions

`default` also supports functions.

Example:

    {
        "created": {
            type: String,
            default: function(fn) {
                fn('This is my default value');
            }
        }
    }

In the above example the function is called whenever the input data does not have a `created` field.

The function *must* take one parameter which holds the callback function to call with the actual default data. The reason is the asynchronous nature of the library and allows for asynchronous work to be done before calling the callback.

#### `required` Validator
Values: `true`, `false` or `'implicit'`.

`required` works a little like default. Except if the value is absent a validation error is send to the callback.

    { type: String, required: true }

The above specifies that the data must be present and be of type `String`.

##### Implicitly Required

Example:

    {
        type: Object,
        required: 'implicit',
        schema: {
            'user': { type: String, required: true }
            'email': { type: String }
        }
    }

The above example is to illustrate what `'implicit'` does. Because the `user` subschema is required, the parent object inherently also becomes required. If none of the subschemas are required, the parent object is also not required.

This enables you to specify that some portion of the data is optional, but if it is present - it's content should have some required fields.

See the example below.

    {
        type: Object,
        required: false,
        schema: {
            'user': { type: String, required: true }
            'email': { type: String }
        }
    }

In the above example the data will validate if the object is not present the input, even though `user` is required - because the parent object is explicitly *not* required. If the object - on the other hand - *is* present it must have the `user` key and it must be of type `String`.

> *Remark:* If `required` is not specified, then `Object` and `Array` types are by default `'implicit'`. All other types are by default non-required. Also `required` is ignored if `default` is specified.

#### `errors` Validator

Type: `Object`

Errors are really not a validator - it allows you to customize the errors emitted by the validators. All validators have default error messages, but these can be customized in order to make user and context friendly error messages.

An example below.

    {
        'username': {
            type: String,
            required: true,
            match: /^[^ @]+$/,
            errors: {
                type: 'Username must be a string.',
                required: 'Username is required.',
                match: 'Username cannot contain any white spaces.'
            }
        }
    }

Now in case any of the validators fail, they will emit the error message specified - instead of the default built-in error message. The `message` property of `ValidationError` will contain the message on validation failure.

### Type Specific Validators

#### Validators Common to Objects and Arrays

##### `schema` Validator

The `schema` validator of object and array types specifies the schema of any children. Objects have keys and values - arrays only have a single schema - which can be an object, though.

An example below of an object schema with a ´user´ key.

    {
         type: Object,
         schema: {
             'username': { type: String }
         }
     }

 And example below of an array of strings.

     {
         type: Array,
         schema: { type: String }
     }

#### Object Validators

##### `allowUnknownKeys` Validator

Type: `Boolean`

This is to make sure that keys not intended in the data are passed through. If an object contains a key unspecified in the schema it will come back with an error - if the value of this validator is set to `false`.

On the other hand - if this is set to `true` - any unknown keys are passed on unvalidated.

> Objects do not allow unknown keys by default.

#### Array Validators

Arrays has two validator besides the common validators.

##### `len` Validator
Type: `Number` or `String`

This ensures that an array has a specific number of items. This can be either a number or a range. The validator sends an error to the callback if the array length is outside the bounds of the specified range(s).

An array that should have exactly 2 items:

    {
        type: Array,
        len: 2,
        schema: { … }
    }

An array that should have at least 2 items:

    {
        type: Array,
        len: '2-',
        schema: { … }
    }

An array that should have a maximum of 2 items:

    {
        type: Array,
        len: '-2',
        schema: { … }
    }

An array that should have at least 2 items and a maximum of 5 items:

    {
        type: Array,
        len: '2-5',
        schema: { … }
    }

An array that should have at two or less items, exactly 5 items or 8 or more items:

    {
        type: Array,
        len: '-2,5,8-',
        schema: { … }
    }

##### `unique` Validator
Type: `Boolean`

This ensures that all elements in the array are unique - basically ensuring the array is a set. If two or more elements are the same, the validator sends an error to the callback.

Example:

    {
        type: Array,
        unique: true,
        schema: { … }
    }

> The `unique` validator does a deep comparison on objects and arrays.

#### String Validators

Strings has one validator besides the common validators.

##### `trim` Validator
Type: `Boolean`

This does not do any actual validation. Instead it trims the input string in both ends - before any other validators are checked. Use this to remove any unforeseen white spaces - added by the user - before any other validation is done.

##### `match` Validator
Type: `RegExp`

This ensures that a string can be matched against a regular expression. The validator sends an error to the callback if the string does not match the pattern.

This example shows a string that must contain a string of at least one character of latin letters or decimal numbers:

    { type: String, match: /^[a-zA-Z0-9]+$/ }

#### Number Validators

Numbers has one validator besides the common validators.

##### `range` Validator
Type: `Number`or `String`

This ensures that the number is within a certain range. If not the validator sends an error to the callback.

> The `range` validator uses the same formatting as the array's `len` validator described above.

## Custom Validators

Custom validators are for usage when the possibilities of the validation schema falls short. Custom validators basically outsources validation to a custom function.

Custom validators are specified by the `custom` field of a schema.

### Example

    {
        type: Object,
        schema: {
            'low': { type: Number }
            'high': { type: Number }
        }
        'custom': function(obj, schema, fn) {
            if (low > high) {
                return fn(new Error('low must be lower than high'));
            }
            fn(null, obj);
        }
    }

In the above example we have specified an object with two keys - `low` and `high`. The validator will first make sure, that the object validates to the schema. If it does it will then call the custom validator - which in this example calls the callback with an error if low is bigger than high.

### The Callback Function

The asynchronous nature of the library, allows for asynchronous operations in custom functions.

The custom function must take three parameters

 - *obj* The Object that needs validation
 - *schema* The schema to validate against
   - This enables you to use the schema to pass in options.
 - *fn* The callback function to call when validation either succeeds or fails.
   - The callback function takes to parameters
     - *err* An `Error` describing the validation error that occurred.
     - *validObj* The finished and validated object.

> *Remark:* Errors are automatically converted into a ValidationError internally.

### Options with Custom Validators

If you need to pass any options to your custom validator, you can do so by using the `options` property of the schema.

An example below.

    {
        'myKey': {
            options: {
            	myCustomOptions: 'here'
            },
            custom: function(obj, schema, fn) {
            	// schema.options will now contain whatever options you supplied in the schema.
            	// In this example schema.options == { myCustomOptions: 'here'}.
            }
        }
    }

Using any other key than `custom` and `options` in conjunction with a custom validator will throw an error.

> Schemas with both `custom` and `type` set will throw a `SchemaError`.

## Automatic Type Conversion

### Numbers

If the schema has type `Number` and the input holds a `String` containing numbers (or/and a point), the validator will automatically convert that into a number.

### Booleans

Likewise will schemas of type `Boolean` be automatically converted into a `Boolean` if a `String` with the value of `true` or `false` is in the data.

### Dates

If the schema is of type `Date` and a `String` containing an [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) formatted date is supplied, it will automatically be parsed and converted into a `Date`.

## Be aware of...

### Object Shortcuts

Internally the library tests for object shortcuts by examining the absent of the `type` and `custom` keys. So if you need objects schemas with validators for keys with those names, you must use explicitly formatted object schemas - hence the shortcut cannot be used.

# License

MIT
