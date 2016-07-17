# History

## Version 1.3.6

* Introduced the `autowrap` validator on `Array` types.

## Version 1.2.0

* Type shortcuts now also include `String`, `Number`, `Boolean` and `Date`.
* The `custom` validator can now take an array of functions.

## In Version 1.0.0

* Opt-in to `null` values using the `allowNull` validator.
* The object `allowUnknownKeys` validator has been deprecated in favor of the new `unknownKeys` validator.

> Version `>= 0.2.4 < 1.0.0` has a bug where `null` is sometimes validated even when input is required. Version 1.0.0 fixes this and introduces the common `allowNull` validator to control the behavior of `null` values.

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
