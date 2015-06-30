# isvalid

[![npm version](https://badge.fury.io/js/isvalid.svg)](https://www.npmjs.com/package/isvalid) [![travis ci](https://travis-ci.org/trenskow/isvalid.svg?branch=master)](https://travis-ci.org/trenskow/isvalid)
-

**isvalid** is an asynchronous node.js library for validating and error correcting JSON. In contrary to JSON Schema it uses a very simple schema model - inspired by the Mongoose schemas.

# What's New?

## In Version 1.0.0

Because of breaking API-changes this version is 1.0.0.

* Opt-in to `null` values using the `allowNull` validator.

> Version >= 0.2.4 has a bug where `null` is validated sometimes when input is non-required - or required objects. Version 1.0.0 fixes this and introduces the common `allowNull` validator to control the behaviour of `null` values.

## In Version 0.3.0

* Bug fixes and internal improvements.
* `type` and `custom` can now be used alongside each other.
* Default functions and custom validators now also works synchronously.
* Strings now has an `enum` validator.
* Changed license to MIT
* Improved this file with a TOC
* Added middleware for Connect/Express (from [isvalid-express](https://github.com/trenskow/isvalid-express)).

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
     * [A Note on the Examples in this Document](#a-note-on-the-examples-in-this-document)
     * [Supported Types](#supported-types)
       * [Validators Available to All Types](#validators-available-to-all-types)
         * [`default`](#default)
           * [Static Values](#static-values)
           * [Functions](#functions)
             * [Asynchronous Functions](#asynchronous-functions)
             * [Synchronous Functions](#synchronous-functions)
         * [`required`](#required)
           * [Implicitly Required](#implicitly-required)
         * [`allowNull`](#allownull)
         * [`errors`](#errors)
       * [Type Specific Validators](#type-specific-validators)
         * [Validators Common to `Object` and `Array`](#validators-common-to-object-and-array)
           * [`schema`](#schema)
         * [`Object` Validators](#object-validators)
           * [`allowUnknownKeys`](#allowunknownkeys)
         * [`Array` Validators](#array-validators)
           * [`len`](#len)
           * [`unique`](#unique)
         * [`String` Validators](#string-validators)
           * [`trim`](#trim)
           * [`match`](#match)
           * [`enum`](#enum)
         * [`Number` Validators](#number-validators)
           * [`range`](#range)
     * [`custom`](#custom)
       * [Asynchronous Example](#asynchronous-example)
         * [The Callback Function](#the-callback-function)
       * [Synchronous Example](#synchronous-example)
       * [Options with Custom Validators](#options-with-custom-validators)
     * [Type Shortcuts](#type-shortcuts)
       * [Object Shortcuts](#object-shortcuts)
       * [Array Shortcuts](#array-shortcuts)
     * [Automatic Type Conversion](#automatic-type-conversion)
       * [Numbers](#numbers)
       * [Booleans](#booleans)
       * [Dates](#dates)
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

## A Note on the Examples in this Document

In order to be a complete schema, schemas must have at least the `type` and/or `custom` validator. But, as you will notice throughout this document, many of the examples that show `Object` schemas has neither. Instead they just specify the available keys - as with the two examples above.

This is because **isvalid** supports type shortcuts for objects and arrays, and you are - if you want to help yourself - going to use them a lot. You can read more about [type shortcuts](#type-shortcuts) in the designated section at the near-bottom of this document.

## Errors

Errors in function parameters or schemas are thrown - as they are developer errors - and validation errors are passed to the
callback.

* Wrong parameters throw `Error` instances.
* Schema errors throw `SchemaError` instances.
* Validation errors are passed to the callback as `ValidationError` instances.

### SchemaError

The `SchemaError` contains the `schema` property which contains the actual schema in which there is an error. It also has the `message` property with the description of the schema error.

### ValidationError

The `ValidationError` contains three properties besides the `message`.

  - `keyPath` is an array indicating the key path in the data where the error occured.
  - `schema` is the schema that failed to validate.
  - `validator` is the name of the validator that failed.

## Supported Types

These types are supported by the validator:

 * `Object`
 * `Array`
 * `String`
 * `Number`
 * `Boolean`
 * `Date`
 * and `custom` validators.

There are some validators that are common to all types, and some types have specific validators.

You specify the type like this:

    { type: String }

In the above example the input must be of type `String`.

All schemas must have the `type` specified and/or have a custom validator through a `custom` function - more about [custom validators](#custom) in it's designated section below.

### Validators Available to All Types

These validators are supported by all types.

#### `default`
Defaults data to specific value if data is not present in input. It takes a specific value or it can call a custom function to retrieve the value.

Type: Any value or a function.

##### Static Values

Example:

    {
        "email": { type: String, default: "email@not.set" }
    }    

This tells the validator, that an `email` key is expected, and if it is not found, it should just assign it with whatever is specified as `default`.

This works with all supported types - below with a boolean type:

    {
        "receive-newsletter": { type: Boolean, default: false }
    }

Now if the `receive-newsletter` field is absent in the data the validator will default it to `false`.

##### Functions

`default` also supports functions.

###### Asynchronous Functions

An asynchronous default function works using a callback.

    {
        "created": {
            type: String,
            default: function(fn) {
                fn('This is my default value');
            }
        }
    }
    
###### Synchronous Functions

A synchronous default function works the same way, except you leave out the callback - and return the value instead.

    {
        "created": {
            type: String,
            default: function() {
                return 'This is my default value';
            }
        }
    }

#### `required`
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

The above example is to illustrate what `'implicit'` does. Because the key `user` in the subschema is required, the parent object inherently also becomes required. If none of the subschemas are required, the parent object is also not required.

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

#### `allowNull`
Type: `Boolean`

This validator allows for `null`-values to pass through - even if the input is required.

    { type: String, required: true, allowNull: true }

In the above example input must be of type `String`, it is required, but `null` is allowed.

> *Remark:* By default `null` is *not* allowed.

#### `errors`

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

#### Validators Common to `Object` and `Array`

##### `schema`

The `schema` validator of `Object` and `Array` types specifies the schema of their children. Objects have keys and values - arrays only have a single schema.

An example below of an object schema with a `user` key.

    {
         type: Object,
         schema: {
             'username': { type: String }
         }
     }

 And an example below of an array of strings.

     {
         type: Array,
         schema: { type: String }
     }

#### `Object` Validators

The `Object` type has only one specific validator - besides the common validators.

##### `allowUnknownKeys`

Type: `Boolean`

This is to make sure that keys not intended in the data are passed through. If an object contains a key unspecified in the schema it will come back with an error - if the value of this validator is set to `false`.

On the other hand - if this is set to `true` - any unknown keys are passed on unvalidated.

> *Remark:* Objects do not allow unknown keys by default.

#### `Array` Validators

The `Array` type has two specific validator - besides the common validators.

##### `len`
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

##### `unique`
Type: `Boolean`

This ensures that all elements in the array are unique - basically ensuring the array is a set. If two or more elements are the same, the validator sends an error to the callback.

Example:

    {
        type: Array,
        unique: true,
        schema: { … }
    }

> The `unique` validator does a deep comparison on objects and arrays.

#### `String` Validators

The `String` type has three specific validator - besides the common validators.

##### `trim`
Type: `Boolean`

This does not do any actual validation. Instead it trims the input in both ends - before any other validators are checked. Use this if you want to remove any unforeseen white spaces added by the user.

##### `match`
Type: `RegExp`

This ensures that a string can be matched against a regular expression. The validator sends an error to the callback if the string does not match the pattern.

This example shows a string that must contain a string of at least one character of latin letters or decimal numbers:

    { type: String, match: /^[a-zA-Z0-9]+$/ }

##### `enum`
Type: `Array`

This is complimentary to `match` - as this could easily be achieved with `match` - but it is simpler and easier to read. The validator ensures that the string can be matched against a set of values. If it does not, it sends an error to the callback.

    { type: String, enum: ['none','some','all'] }

In the above example the string can only have the values of `none`, `some` or `all`.

> Remark that `enum` is case sensitive.

#### `Number` Validators

The `Number` type has only one specific validator - besides the common validators.

##### `range`
Type: `Number`or `String`

This ensures that the number is within a certain range. If not the validator sends an error to the callback.

> The `range` validator uses the same formatting as the array's [`len`](#len) validator described above.

## `custom`

Custom validators are for usage when the possibilities of the validation schema falls short. Custom validators basically outsources validation to a custom function.

Custom validators are specified by the `custom` field of a schema.

> `type` becomes optional when using `custom`. You can completely leave out any validation and just use a `custom` validator.

### Asynchronous Example

    {
        type: Object,
        schema: {
            'low': { type: Number }
            'high': { type: Number }
        }
        'custom': function(data, schema, fn) {
            if (data.low > data.high) {
                return fn(new Error('low must be lower than high'));
            }
            fn(null, data);
        }
    }

In the above example we have specified an object with two keys - `low` and `high`. The validator will first make sure, that the object validates to the schema. If it does it will then call the custom validator - which in this example calls the callback with an error if low is bigger than high.

#### The Callback Function

The asynchronous nature of the library, allows for asynchronous operations in custom functions.

The custom function must take three parameters

 - *data* The data that needs validation
 - *schema* The schema to validate against
   - This enables you to use the schema to pass in options.
 - *fn* The callback function to call when validation either succeeds or fails.
   - The callback function takes two parameters
     - *err* An `Error` describing the validation error that occurred.
     - *data* The finished and validated object.

> *Remark:* Errors are automatically converted into a `ValidationError` internally.

### Synchronous Example

The `custom` validator also supports synchronous functions, which is done by simple leaving out the callback parameter - and instead errors are thrown.

    {
        type: Object,
        schema: {
            'low': { type: Number }
            'high': { type: Number }
        }
        'custom': function(data, schema) {
            if (data.low > data.high) {
                throw new Error('low must be lower than high');
            }
            return data;
        }
    }
    
> Thrown errors are caught and converted to a `ValidationError` internally.

### Options with Custom Validators

If you need to pass any options to your custom validator, you can do so by using the `options` property of the schema.

An example below.

    {
        'myKey': {
            options: {
            	myCustomOptions: 'here'
            },
            custom: function(data, schema, fn) {
            	// schema.options will now contain whatever options you supplied in the schema.
            	// In this example schema.options == { myCustomOptions: 'here'}.
            }
        }
    }

## Type Shortcuts

Some types can be specified using shortcuts. Instead of specifying the type, you simply just use the type. This works with `Object` and `Array` types.

In this document we've been using them extensively on `Object` examples, and the first example of this document should have looked like this, if it hadn't been used.

    isvalid(somedata, {
        type: Object,
        schema: {
            'user': { type: String, required: true },
            'pass': { type: String, required: true }
        }
    }, function(err, validObj) {
        /*
        err:      Error describing invalid data.
        validObj: The validated data.
        */
    });

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

Which means that data should be an object with a `user` key of the type `String`.

> *Remark:* Internally the library tests for object shortcuts by examining the absent of the `type` and `custom` validators. So if you need objects schemas with validators for keys with those names, you must explicitly format the object using `type` and `schema` - hence the shortcut cannot be used.

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

## Automatic Type Conversion

### Numbers

If the schema has type `Number` and the input holds a `String` containing numbers (or/and a point), the validator will automatically convert the string into a number.

### Booleans

Likewise will schemas of type `Boolean` be automatically converted into a `Boolean` if a `String` with the value of `true` or `false` is in the data.

### Dates

If the schema is of type `Date` and a `String` containing an [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) formatted date is supplied, it will automatically be parsed and converted into a `Date`.

ISO-8601 is the date format that `JSON.stringify(...)` convert `Date` instances into, so this allows you to just serialize an object to JSON on - as an example - the client side, and then **isvalid** will automatically convert that into a `Date` instance when validating on the server side.

No more needs for manual conversions!

(Contributed by [thom-nic](https://github.com/thom-nic))

# License

MIT
