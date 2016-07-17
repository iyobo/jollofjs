# isvalid

[![npm version](https://badge.fury.io/js/isvalid.svg)](https://www.npmjs.com/package/isvalid) [![travis ci](https://travis-ci.org/trenskow/isvalid.svg?branch=master)](https://travis-ci.org/trenskow/isvalid) [![Join the chat at https://gitter.im/trenskow/isvalid](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/trenskow/isvalid?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
-

**isvalid** is an asynchronous node.js library for validating and error correcting JSON. In contrary to JSON Schema it uses a very simple schema model - inspired by the Mongoose schemas.

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
					 * [`unknownKeys`](#unknownkeys)
					 * [`allowUnknownKeys`](#allowunknownkeys-deprecated) [deprecated]
				 * [`Array` Validators](#array-validators)
					 * [`len`](#len)
					 * [`unique`](#unique)
					 * [`autowrap`](#autowrap)
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
			 * [Multiple Custom Validators](#multiple-custom-validators)
		 * [Type Shortcuts](#type-shortcuts)
			 * [Object Shortcuts](#object-shortcuts)
			 * [Array Shortcuts](#array-shortcuts)
			 * [Other Shortcuts](#other-shortcuts)
		 * [Automatic Type Conversion](#automatic-type-conversion)
			 * [Numbers](#numbers)
			 * [Booleans](#booleans)
			 * [Dates](#dates)
	 * [Changelog](#changelog)
	 * [License](#license)

# How to Use

**isvalid** uses a simple schema modal to specify how the data should be formatted. It supports generic validators for all types and type specific validators.

Usage: `isvalid(dataToValidate, validationSchema, callback)`

## Example

Here's a simple example on how to use the validator.

		var isvalid = require('isvalid');

		isvalid(inputData, {
				'user': { type: String, required: true },
				'pass': { type: String, required: true }
		}, function(err, validData) {
			/*
			err:			 Error describing invalid data.
			validData: The validated data.
			*/
		});

## As Connect or Express Middleware

Connect and Express middleware is build in.

Usage: `isvalid.validate.body(schema)` validates `req.body`.
Usage: `isvalid.validate.query(schema)` validates `req.query`.
Usage: `isvalid.validate.param(schema)` validates `req.param`.

### Example

		var validate = require('isvalid').validate;

		app.param('myparam', validate.param(Number));

		app.post('/mypath/:myparam',
			validate.query({
					'filter': String
			}),
			validate.body({
					'mykey': { type: String, required: true }
			}),
			function(req, res) {
					// req.param.myparam, req.body and req.query are now validated.
					// - any default values - or type conversion - has been applied.
			}
		);

> Remark: If validation fails `isvalid` will unset the validated content (eg. `req.body` will become `null` if body validation fails). This is to ensure that routes does not get called with invalid data, in case a validation error isn't correctly handled.

# How it Works

**isvalid** is a comprehensive validation library - build for ease of use. Both as Connect or Express middleware - where it comes in really handy - or as stand alone.

## A Note on the Examples in this Document

In order to be a complete schema, schemas must have at least the `type` and/or `custom` validator. But, as you will notice throughout this document, many of the examples lots of validators with neither. Instead they just use the type shortcuts.

This is because **isvalid** supports type shortcuts for all its supported types, and you are - if you want to help yourself - going to use them a lot. You can read more about [type shortcuts](#type-shortcuts) in the designated section at the near-bottom of this document.

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

or if `type` is your only validator, you can also do this:

		String

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
						'email': String
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
						'email': String
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
						 'username': String
				 }
		 }

 And an example below of an array of strings.

		 {
				 type: Array,
				 schema: String
		 }

#### `Object` Validators

The `Object` type has only one specific validator - besides the common validators (it has two, though, but the one is deprecated in favour of the other.)

##### `unknownKeys`
Type `String` of values: `'allow'`, `'deny'` or `'remove'`

This validator is used to control how unknown keys in objects are handled.

The validator has three options:

* `allow` Pass any unknown key onto the validated object.
* `deny` Come back with error if object has unknown key.
* `remove` Remove the unknown key from the validated object.

An example below.

		{
				type: Object,
				unknownKeys: 'remove',
				schema: {
						awesome: Boolean
				}
		}

In the above example, if you validated the following object, the `why` key would be absent from the validated data.

		{
				awesome: true,
				why: 'It is!'
		}

> Default is `deny`.

##### `allowUnknownKeys` [deprecated]

Type: `Boolean`

**This validator has been deprecated in favour of [`unknownKeys`](#unknownkeys), and will be removed in the next major version. Please update your schemas.**

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

##### `autowrap`
Type: `Boolean`

If the provided data is not an array - but it matches the subschema - this will wrap the data in an array before actual validation.

Example:

		{
				type: Array,
				autowrap: true,
				schema: { … }
		}

> Default is `false`.

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
						'low': Number,
						'high': Number
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
						'low': Number
						'high': Number
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

### Multiple Custom Validators

The `custom` validator also support an array of validators. Instead of providing a function, provide an array of functions. Synchronous and asynchronous can be mixed and matched as necessary.

An example.

		{
				custom: [
						function(data, schema, fn) {
								data(null, myValidatedData);
						},
						function(data, schema) {
								return mySecondValidatedData
						}
				]
		}

If, though, any of the custom validator functions returns an error (either using the callback in an asynchronous function, or by throwing an error in a synchronous one), none of the rest of the custom validators in the custom validator chain will get called, and isvalid will return an error.

> The custom validator functions are called in order.

## Type Shortcuts

Some types can be specified using shortcuts. Instead of specifying the type, you simply just use the type. This works with `Object` and `Array` types.

In this document we've been using them extensively on `Object` examples, and the first example of this document should have looked like this, if it hadn't been used.

		isvalid(inputData, {
				type: Object,
				schema: {
						'user': { type: String, required: true },
						'pass': { type: String, required: true }
				}
		}, function(err, validData) {
				/*
				err:			 Error describing invalid data.
				validData: The validated data.
				*/
		});

### Object Shortcuts

Object shortcuts are used like this:

		{
				"user": String
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

		[String]

is essentially the same as:

		{
				type: Array,
				schema: { type: String }
		}

Which means the data must be an array of strings.

### Other Shortcuts

The others are a bit different. They are - in essence - a shortcut for the validator `type`. Instead of writing `type` you just specify the type directly. Available types are all the supported types of isvalid, namely `Object`, `Array`, `String`, `Number`, `Boolean` and `Date`.

An example below.

		{
				"favorite_number": Number
		}

The above example is really an example of two shortcuts in one - the `Object` and the `Number` type shortcut. The above example would look like the one below, if shortcuts had not been used.

		{
				type: Object,
				schema: {
						"favorite_number": { type: Number }
				}
		}

## Automatic Type Conversion

### Numbers

If the schema has type `Number` and the input holds a `String` containing numbers (or/and a point), the validator will automatically convert the string into a number.

### Booleans

Likewise will schemas of type `Boolean` be automatically converted into a `Boolean` if a `String` with the value of `true` or `false` is in the data.

### Dates

If the schema is of type `Date` and a `String` containing an [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) formatted date is supplied, it will automatically be parsed and converted into a `Date`.

ISO-8601 is the date format that `JSON.stringify(...)` convert `Date` instances into, so this allows you to just serialize an object to JSON on - as an example - the client side, and then **isvalid** will automatically convert that into a `Date` instance when validating on the server side.

# License

MIT
