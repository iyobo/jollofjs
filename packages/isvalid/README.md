# isvalid.js

**isvalid.js** is an asynchronous node.js library for validating and error correcting JSON. It uses a schema modal - inspired by Mongoose schemas.

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

The `isvalid` function takes three parameters.

    isvalid(dataToValidate, validationSchema, callback);

## Usage with Express.js

For usage with express.js - validating body and query data - use the easier [isvalid-express.js](https://github.com/trenskow/isvalid-express.js) library.

# How to Use

**isvalid.js** uses a simple schema modal to specify how the data should be formatted. It supports generic validators for all types and type specific validators.

## Errors

Errors in function parameters or schemas are thrown - validation errors are passed to the callback. Thrown errors are of type `Error`. Validation errors are of type `ValidationError`, which is a custom `Error` type.

### ValidationError

The `ValidationError` contains two fields besides the `message` field of `Error`.

  - `keyPath` is an array indicating the key path in the data where the error occured.
  - `schema` is the schema that failed to validate.

## Type Shortcuts

Some types can be made with shortcuts. Instead of specifying the type, you just use the type. This works with objects and arrays.

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

and is in fact the as this:

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

There are some validators that are common to all types, and then some types have specific validators.

You specify the type like this:

    { type: String }

In the above example the type must be a `String`.

All schemas must have the `type` specified - or have a custom validator through a custom function. See more about custom validator in it's designated section below.

Object and array shortcuts apply their type automatically. In fact the library uses the absent of `type` to determine object shortcuts.

### Common Validators

These validators are supported by all types.

#### Default Validator
Defaults data to specific value if data is not present in input. It takes a specific value or it can call a custom function to retrieve the value.

Values: Any value or a function.

##### Static Values

Example:

    {
        "email": { type: String, default: "email@not.set" }
    }

This tells the validator, that an `email` field is expected, and if it is not found, it should just assign it with whatever is specified using default.

This works with all supported types - below with a boolean type:

    {
        "receive-newsletter": { type: Boolean, default: true }
    }

Now if the `receive-newsletter` field has not been specified, the validator will default it to `true`.

##### Functions

`default` also supports custom functions.

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

#### Required Validator
Values: `true`, `false` or `'implicit'`.

`required` works a little like default. Except if the value is absent an error is returned. `required` is ignored if `default` is also specified.

Example:

    "user": { type: String, required: true }

##### Implicit Required

Example:

    {
        type: Object,
        required: 'implicit',
        schema: {
            'user': { type: String, required: true }
            'email': { type: String }
        }
    }

The above example is to illustrate what `'implicit'` does. Because the `user` subschema is required, the parent object inherently also becomes required. If none of the subschemas is required, the parent object is also not required.

This enables you to specify that some portion of the data is optional, but if it is present - it's content should have some required fields.

Example:

    {
        type: Object,
        required: false,
        schema: {
            'user': { type: String, required: true }
            'email': { type: String }
        }
    }

In the above example the data will validate if the object is not in the input. Even though `user` is required. Because the object is explicitly not required.

*Remark:* `Object`s and `Array`s are by default `'implicit'` if `required` is not specified. All other are by default non-required.

### Type Specific Validators

#### Array Validators

Arrays has two validator besides the common validators.

##### Len Validator
Values: `Number` or `String`

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

##### Unique Validator
Type: `Boolean`

This ensures that all elements in the array are unique - basically ensuring the array is a set. If two or more elements are the same, the validator sends an error to the callback.

Example:

    {
        type: Array,
        unique: true,
        schema: { … }
    }

The `unique` validator does a deep comparison on `Object`s and `Array`s.

#### String Validators

Strings has one validator besides the common validators.

##### Match Validator
Values: A `RegExp`

This ensures that a string can be matched against a regular expression. The validator sends an error to the callback if the string does not match the pattern.

This example shows a string that must contain a string of at least one character of latin letters or decimal numbers:

    { type: String, match /^[a-zA-Z0-9]+$/ }

#### Number Validators

Numbers has one validator besides the common validators.

##### Range Validator
Values: `Number`or `String`

This ensures that the number is within a certain range. If not the validator sends an error to the callback.

The `range` validator supports the same formatting as the array's `len` validator described above.

#### Date Validators

Date has no custom validators - though future validators are in the planning. Submit an [issue](https://github.com/trenskow/isvalid.js/issues) if you have any suggestions.

Date does - though - have automatic conversion of ISO-8601 formatted strings. See below for more information.

## Custom Validators

Custom validators are for usage when the possibilities of the validation schema falls short. Custom validators basically outsources validation to a custom function.

Custom validators are specified by the `custom` field of a schema - instead of `type`.

Example (remark the absent of `type`):

    {
        'date': {
            custom: function(obj, schema, fn) {
                if (!(obj instanceof Date)) {
                	return fn(new Error('Type is not a Date'));
                }
                fn(null, obj);
            }
        }
    }

In the above example we have specified a custom validator. In the specific case we test whether the data is of type `Date`. If not we pass an error to the callback. Otherwise we call the callback function with no error and the valid object.

The asynchronous nature of the library, allows for asynchronous operations in custom functions.

The custom function must take three parameters

 - *obj* The Object that needs validation
 - *schema* The schema to validate against
   - This enables you to use the schema to pass in options.
 - *fn* The callback function to call when validation is either complete or failed.
   - The callback function takes to parameters
     - *err* An `Error` describing the validation error that occurred.
     - *validObj* The finished and validated object.

*Remark:* Errors are automatically converted into a ValidationError and sent to the the callback internally.

## Automatic Type Conversion

### Numbers

If the schema has type `Number` and the input holds a `String` containing numbers (or/and a point), the validator will automatically convert that into a number.

### Booleans

Likewise will schemas of type `Boolean` be automatically converted into a `Boolean` if a `String` with the value of `true` or `false` is in the data.

### Date

If the schema is of type `Date` and a `String` containing an [ISO-8601](http://en.wikipedia.org/wiki/ISO_8601) formatted date is supplied, it will automatically be parsed and converted into a `Date`.

## Be aware of...

### Object Shortcuts

Internally the library tests for object shortcuts by examining the absent of the `type` and `custom` keys. So if you need objects schemas with validators for those keys, then you must use explicitly formatted object schemas - hence the shortcut cannot be used.