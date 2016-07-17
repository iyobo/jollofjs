/*jshint expr: true*/
'use strict';

var chai = require('chai'),
	expect = chai.expect,
	assert = chai.assert,
	ValidationError = require('../lib/errors/ValidationError.js'),
	isvalid = require('../');

var commonTests = {
	type: function(type, validData, invalidData) {
		describe('type', function() {
			it ('should come back with an error if input is not a(n) ' + type.name + '.', function(done) {
				isvalid(invalidData, type, function(err, validData) {
					expect(validData).to.be.undefined;
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('type');
					expect(err).to.have.property('message').equal('Is not of type ' + type.name + '.');
					expect(err).to.have.property('keyPath').of.length(0);
					done();
				});
			});
			it ('should come back with no error if input is a(n) ' + type.name + '.', function(done) {
				isvalid(validData, {
					type: type
				}, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.be.a(type.name);
					done();
				});
			});
			describe('#errors', function() {
				it ('should come back with an error of custom message if input is not a(n) ' + type.name + '.', function(done) {
					isvalid(invalidData, {
						type: type,
						errors: {
							type: 'Type custom error message.'
						}
					}, function(err, validData) {
						expect(validData).to.be.undefined;
						expect(err).to.be.instanceof(ValidationError);
						expect(err).to.have.property('validator').equal('type');
						expect(err).to.have.property('message').equal('Type custom error message.');
						expect(err).to.have.property('keyPath').of.length(0);
						done();
					});
				});
			});
		});
	},
	required: function(type, validData) {
		describe('required', function() {
			it ('should come back with an error if required and input is undefined.', function(done) {
				isvalid(undefined, {
					type: type,
					required: true
				}, function(err, validData) {
					expect(validData).to.be.undefined;
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('required');
					expect(err).to.have.property('message').equal('Data is required.');
					expect(err).to.have.property('keyPath').of.length(0);
					done();
				});
			});
			it ('should come back with no error if required and input is present', function(done) {
				isvalid(validData, {
					type: type,
					required: true
				}, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.be.a(type.name);
					done();
				});
			});
			describe('#errors', function() {
				it ('should come back with an error with custom message if required and input is undefined.', function(done) {
					isvalid(undefined, {
						type: type,
						required: true,
						errors: {
							required: 'Required custom error message.'
						}
					}, function(err, validData) {
						expect(validData).to.be.undefined;
						expect(err).to.have.property('validator').equal('required');
						expect(err).to.have.property('message').equal('Required custom error message.');
						expect(err).to.have.property('keyPath').of.length(0);
						done();
					});
				});
			});
		});
	},
	allowNull: function(type, validData) {
		describe('allowNull', function() {
			it ('should come back with an error if required and does not allow null and input is null.', function(done) {
				isvalid(null, {
					type: type,
					required: true
				}, function(err, validData) {
					expect(validData).to.be.undefined;
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('allowNull');
					expect(err).to.have.property('message').equal('Cannot be null.');
					expect(err).to.have.property('keyPath').of.length(0);
					done();
				});
			});
			it ('should come back with no error if required and allows null and input is null.', function(done) {
				isvalid(null, {
					type: type,
					required: true,
					allowNull: true
				}, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.be.null;
					done();
				});
			});
			describe('#errors', function() {
				it ('should come back with an error with custom message if required and does not allow null and input is null.', function(done) {
					isvalid(null, {
						type: type,
						required: true,
						errors: {
							allowNull: 'Allow null custom error message.'
						}
					}, function(err, validData) {
						expect(validData).to.be.undefined;
						expect(err).to.be.instanceof(ValidationError);
						expect(err).to.have.property('validator').equal('allowNull');
						expect(err).to.have.property('message').equal('Allow null custom error message.');
						expect(err).to.have.property('keyPath').of.length(0);
						done();
					});
				});
			});
		});
	},
	default: function(type, validData) {
		describe('default', function() {
			it ('should call default if function with callback is provided.', function(done) {
				isvalid(undefined, { type: type, default: function(cb) {
					cb(validData);
				} }, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.be.a(type.name);
					done();
				});
			});
			it ('should call default if function with no callback is provided.', function(done) {
				isvalid(undefined, { type: type, default: function() {
					return validData;
				} }, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.be.a(type.name);
					done();
				});
			});
		});
	},
	custom: function() {
		describe('custom', function() {
			it ('should call function if custom is specified.', function(done) {
				isvalid('test', {
					custom: function(obj, schema, fn) {
						expect(obj).to.be.a('String').equals('test');
						fn(null, 'test2');
					}
				}, function(err, validData) {
					expect(validData).to.be.a('String').equals('test2');
					done();
				});
			});
			it ('should call function if synchronous custom is specified.', function(done) {
				isvalid(undefined, {
					custom: function(obj, schema) {
						return 'test';
					}
				}, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.be.a('String').equal('test');
					done();
				});
			});
			it ('should convert errors thrown in synchronous custom function.', function(done) {
				isvalid('test', {
					custom: function(obj, schema) {
						throw new Error('an error');
					}
				}, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('custom');
					expect(err).to.have.property('message').equal('an error');
					done();
				});
			});
			it ('should return original object if synchronous function doesn\'t return.', function(done) {
				isvalid('test', {
					custom: function(obj, schema) {}
				}, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.be.a('String').equal('test');
					done();
				});
			});
			it ('should reformat err if custom is specified and returns an error.', function(done) {
				isvalid({}, {
					custom: function(obj, schema, fn) {
						fn(new Error('This is an error'));
					}
				}, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('custom');
					done();
				});
			});
			it ('should pass on custom schema options if specified.', function(done) {
				isvalid({}, {
					custom: function(obj, schema, fn) {
						expect(schema).to.have.property('options').to.be.equal('test');
						fn();
					},
					options: 'test'
				}, function(err, validData) {
					done();
				});
			});
			it ('should first validate using validators and then custom.', function(done) {
				isvalid({
					'low': 0
				}, {
					type: Object,
					schema: {
						'low': { type: Number },
						'high': { type: Number, default: 10 },
					},
					custom: function(obj, schema, fn) {
						expect(obj.high).to.equal(10);
						fn(null, obj);
					}
				}, function(err, validData) {
					expect(validData).to.have.property('low').equal(0);
					expect(validData).to.have.property('high').equal(10);
					done();
				});
			});
			it ('should call all custom validators in array.', function(done) {
				isvalid(0, {
					custom: [
						function(data, schema, cb) {
							cb(null, data + 1);
						},
						function(data, schema) {
							return data + 2;
						},
						function(data, schema, cb) {
							cb(null, data + 3);
						},
						function(data, schema) {
							return data + 4;
						}
					]
				}, function(err, validData) {
					expect(validData).to.equal(10);
					done();
				});
			});
			it ('should come back with error if thrown underway.', function(done) {
				isvalid(0, {
					custom: [
						function(data, schema, cb) {
							cb(null, data + 1);
						},
						function(data, schema) {
							throw new Error('Stop here');
						},
						function(data, schema, cb) {
							assert(false, 'This custom function should not have been called.');
							cb(null, data + 3);
						},
						function(data, schema) {
							assert(false, 'This custom function should not have been called.');
							return data + 4;
						}
					]
				}, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('custom');
					done();
				});
			});
		});
	},
	all: function(type, validData, invalidData) { var self = this;
		['type', 'required', 'allowNull', 'default', 'custom'].forEach(function(test) {
			self[test](type, validData, invalidData);
		});
	}
};

describe('validate', function() {
	it ('should throw an error if schema is not provided.', function() {
		expect(function() {
			isvalid({}, undefined, undefined);
		}).to.throw(Error);
	});
	it ('should throw an error if callback is not provided.', function() {
		expect(function() {
			isvalid({}, {}, undefined);
		}).to.throw(Error);
	});
	describe('type conversion', function() {
		it ('should convert string values into numbers if string contains a number.', function(done) {
			isvalid('123.987', Number, function(err, validData) {
				expect(err).to.be.null;
				expect(validData).to.equal(123.987);
				done();
			});
		});
		it ('should convert string values into numbers if string contains a negative number.', function(done) {
			isvalid('-123.987', Number, function(err, validData) {
				expect(err).to.be.null;
				expect(validData).to.equal(-123.987);
				done();
			});
		});
		it ('should come back with error if string is supplied - but not a number.', function(done) {
			isvalid('abc', Number, function(err, validData) {
				expect(err).to.be.instanceof(ValidationError);
				expect(err).to.have.property('validator').equal('type');
				done();
			});
		});
		it ('should come back with no error and validData set to true if input is string with \'True\'.', function(done) {
			isvalid('True', Boolean, function(err, validData) {
				expect(err).to.be.null;
				expect(validData).to.equal(true);
				done();
			});
		});
		it ('should come back with no error and validData set to false if input is string with \'False\'.', function(done) {
			isvalid('False', Boolean, function(err, validData) {
				expect(err).to.be.null;
				expect(validData).to.equal(false);
				done();
			});
		});
		it ('should come back with error and if string is supplied - but not \'true\' or \'false\'.', function(done) {
			isvalid('123', Boolean, function(err, validData) {
				expect(err).to.be.instanceof(ValidationError);
				expect(err).to.have.property('validator').equal('type');
				done();
			});
		});
		it ('should come back with no error and validData set to a Date if input is string with an ISO date.', function(done) {
			isvalid('2014-10-19T02:24:42.395Z', Date, function(err, validData) {
				expect(err).to.be.null;
				expect(validData.getTime()).to.equal(new Date("2014-10-19T02:24:42.395Z").getTime());
				done();
			});
		});
		it ('should come back with error and if string is supplied - but not ISO date.', function(done) {
			isvalid('19/10/14 2:24:42', Date, function(err, validData) {
				expect(err).to.be.instanceof(ValidationError);
				expect(err).to.have.property('validator').equal('type');
				done();
			});
		});
	});
	describe('object validator', function() {
		commonTests.all(Object, {}, 123);
		it ('should come out with same input as output if keys can validate.', function(done) {
			isvalid({
				awesome: true,
				why: 'It just is!'
			}, {
				awesome: Boolean,
				why: String
			}, function(err, validData) {
				expect(err).to.be.null;
				expect(validData).to.have.property('awesome').equals(true);
				expect(validData).to.have.property('why').equals('It just is!');
				done();
			});
		});
		it ('should come back with no error and validData if object shortcut is empty.', function(done) {
			isvalid({}, {}, function(err, validData) {
				expect(err).to.be.null;
				expect(validData).to.be.a('Object');
				done();
			});
		});
		describe('unknownKeys', function() {
			it ('should come back with unknown keys intact if unknownKeys is \'allow\'.', function(done) {
				isvalid({
					awesome: true,
					why: 'It just is!'
				}, {
					type: Object,
					unknownKeys: 'allow',
					schema: {
						awesome: Boolean
					}
				}, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.have.property('why').equals('It just is!');
					done();
				});
			});
			it ('should come back with unknown keys intact if unknownKeys is provided as \'allow\' in options.', function(done) {
				isvalid({
					awesome: true,
					why: 'It just is!'
				}, {
					awesome: Boolean
				}, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.have.property('why').equals('It just is!');
					done();
				}, { unknownKeys: 'allow' });
			});
			it ('should come back with error if there are unknown keys and unknownKeys is not set.', function(done) {
				isvalid({
					awesome: true,
					why: 'It just is!'
				}, {
					awesome: Boolean
				}, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('unknownKeys');
					expect(err).to.have.property('message').equal('Unknown key.');
					expect(err).to.have.property('keyPath').of.length(1);
					done();
				});
			});
			it ('should come back with error if there are unknown keys and unknownKeys is set to \'deny\'.', function(done) {
				isvalid({
					awesome: true,
					why: 'It just is!'
				}, {
					type: Object,
					unknownKeys: 'deny',
					schema: {
						awesome: Boolean
					}
				}, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('unknownKeys');
					expect(err).to.have.property('message').equal('Unknown key.');
					expect(err).to.have.property('keyPath').of.length(1);
					done();
				});
			});
			it ('should come back with keys removed if unknown keys and unknownKeys is set to \'remove\'.', function(done) {
				isvalid({
					awesome: true,
					why: 'It just is!'
				}, {
					type: Object,
					unknownKeys: 'remove',
					schema: {
						awesome: Boolean
					}
				}, function(err, validData) {
					expect(validData).to.not.have.property('why');
					done();
				});
			});
			describe('#errors', function() {
				it ('should come back with error of custom message if there are unknown keys and unknownKeys is set to \'deny\'.', function(done) {
					isvalid({
						awesome: true,
						why: 'It just is!'
					}, {
						type: Object,
						unknownKeys: 'deny',
						schema: {
							awesome: Boolean
						},
						errors: {
							unknownKeys: 'Not allowed.'
						}
					}, function(err, validData) {
						expect(err).to.be.instanceof(ValidationError);
						expect(err).to.have.property('validator').equal('unknownKeys');
						expect(err).to.have.property('message').equal('Not allowed.');
						expect(err).to.have.property('keyPath').of.length(1);
						done();
					});
				});
			});
		});
		describe('allowUnknownKeys [deprecated]', function() {
			it ('should come back with error with old validator name if allowUnknownKeys was converted to unknownKeys.', function(done) {
				isvalid({
					awesome: true,
					why: 'It just is!'
				}, {
					type: Object,
					allowUnknownKeys: false,
					schema: {
						awesome: Boolean
					}
				}, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('allowUnknownKeys');
					expect(err).to.have.property('message').equal('Unknown key.');
					expect(err).to.have.property('keyPath').of.length(1);
					done();
				});
			});
			describe('#errors', function() {
				it ('should come back with error with old validator name and custom message if allowUnknownKeys was converted to unknownKeys.', function(done) {
					isvalid({
						awesome: true,
						why: 'It just is!'
					}, {
						type: Object,
						allowUnknownKeys: false,
						schema: {
							awesome: Boolean
						},
						errors: {
							allowUnknownKeys: 'Not allowed.'
						}
					}, function(err, validData) {
						expect(err).to.be.instanceof(ValidationError);
						expect(err).to.have.property('validator').equal('allowUnknownKeys');
						expect(err).to.have.property('message').equal('Not allowed.');
						expect(err).to.have.property('keyPath').of.length(1);
						done();
					});
				});
			});
		});
	});
	describe('array validator', function() {
		commonTests.all(Array, [], 123);
		it ('should come out with same input as output if array can validate.', function(done) {
			isvalid([{
				awesome: true,
				why: 'It just is!'
			}], [{
				awesome: Boolean,
				why: String
			}], function(err, validData) {
				expect(err).to.be.null;
				expect(validData).to.be.an('Array').of.length(1);
				expect(validData[0]).to.have.property('awesome').equals(true);
				expect(validData[0]).to.have.property('why').equals('It just is!');
				done();
			});
		});
		it ('should come back with no error and an empty array when supplying empty array.', function(done) {
			isvalid([], [{}], function(err, validData) {
				expect(err).to.be.null;
				expect(validData).to.have.length(0);
				done();
			});
		});
		describe('len', function() {
			it ('should come back with same input as output if within ranges of len.', function(done) {
				isvalid([1,2], {
					type: Array,
					len: '2-',
					schema: Number
				}, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.be.an('Array').of.length(2);
					done();
				});
			});
			it ('should come back with error if array length is not within ranges of len.', function(done) {
				isvalid([], {
					type: Array,
					len: '2-',
					schema: {}
				}, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('len');
					expect(err).to.have.property('message').equal('Array length is not within range of \'2-\'.');
					expect(err).to.have.property('keyPath').of.length(0);
					done();
				});
			});
			describe('#errors', function() {
				it ('should come back with error of custom message if array length is not within ranges of len.', function(done) {
					isvalid([], {
						type: Array,
						len: '2-',
						schema: {},
						errors: {
							len: 'Not within range.'
						}
					}, function(err, validData) {
						expect(err).to.be.instanceof(ValidationError);
						expect(err).to.have.property('validator').equal('len');
						expect(err).to.have.property('message').equal('Not within range.');
						expect(err).to.have.property('keyPath').of.length(0);
						done();
					});
				});
			});
		});
		describe('unique', function() {
			it ('should come back with error if array of objects is not unique.', function(done) {
				isvalid([{
					awesome: true
				},{
					awesome: true
				}], {
					type: Array,
					unique: true,
					schema: { awesome: Boolean }
				}, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('unique');
					expect(err).to.have.property('message').equal('Array is not unique.');
					expect(err).to.have.property('keyPath').of.length(0);
					done();
				});
			});
			it ('should come back with no error if array of strings is unique.', function(done) {
				isvalid(['This', 'is', 'an', 'array'], {
					type: Array,
					unique: true,
					schema: String
				}, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.have.length(4);
					done();
				});
			});
			describe('#errors', function() {
				it ('should come back with error of custom message if array of objects is not unique.', function(done) {
					isvalid([{
						awesome: true
					},{
						awesome: true
					}], {
						type: Array,
						unique: true,
						schema: { awesome: Boolean },
						errors: {
							unique: 'Not a set.'
						}
					}, function(err, validData) {
						expect(err).to.be.instanceof(ValidationError);
						expect(err).to.have.property('validator').equal('unique');
						expect(err).to.have.property('message').equal('Not a set.');
						expect(err).to.have.property('keyPath').of.length(0);
						done();
					});
				});
			});
			describe('autowrap', function() {
				it ('should come back with non-array wrapped in array', function(done){
					isvalid({
						test: true
					}, {
						type: Array,
						autowrap: true,
						schema: {
							test: Boolean
						}
					}, function(err, validData) {
						 expect(err).to.be.null;
						 expect(validData).to.be.an('array').lengthOf(1);
						 expect(validData[0]).to.have.property('test').equal(true);
						 done();
					 });
				});
				it ('should come back with type error if autowrap and not matching subschema.', function(done) {
					isvalid({
						test: 'Not a boolean'
					}, {
						type: Array,
						autowrap: true,
						schema: {
							test: Boolean
						}
					}, function(err, validData) {
						 expect(err).to.be.instanceOf(ValidationError);
						 expect(err).to.have.property('validator').equal('type');
						 done();
					 });
				});
				it ('should come back with type error if no autowrap and matching subschema.', function(done) {
					isvalid({
						test: true
					}, [{
						test: Boolean
					}], function(err, validData) {
						 expect(err).to.be.instanceOf(ValidationError);
						 expect(err).to.have.property('validator').equal('type');
						 done();
					 });
				});
			});
		});
	});
	describe('string validator', function() {
		commonTests.all(String, 'string', 123);
		it ('should come back with no error and input same as output if string is supplied.', function(done) {
			isvalid('123', String, function(err, validData) {
				expect(err).to.be.null;
				expect(validData).to.be.a('String').equals('123');
				done();
			});
		});
		describe('trim', function() {
			it ('should come back with trimmed string when trim is set to true.', function(done) {
				isvalid('	123abc	', { type: String, trim: true }, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.equal('123abc');
					done();
				});
			});
			it ('should come back with trimmed string when trim option is true.', function(done) {
				isvalid('	123abc	', String, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.equal('123abc');
					done();
				}, { trim: true });
			});
		});
		describe('match', function() {
			it ('should come back with an error if string does not match RegExp.', function(done) {
				isvalid('123', { type: String, match: /^[a-z]+$/ }, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('match');
					expect(err).to.have.property('message').equal('Does not match expression ^[a-z]+$.');
					expect(err).to.have.property('keyPath').of.length(0);
					done();
				});
			});
			it ('should come back with no error and validData should match input string when match is specified and input matches.', function(done) {
				isvalid('123', { type: String, match: /^[0-9]+$/ }, function(err, validData) {
					expect(validData).to.equal('123');
					done();
				});
			});
			describe('#errors', function() {
				it ('should come back with an error of custom message if string does not match RegExp.', function(done) {
					isvalid('123', {
						type: String,
						match: /^[a-z]+$/,
						errors: {
							match: 'Must be a string of letters from a to z.'
						}
					}, function(err, validData) {
						expect(err).to.be.instanceof(ValidationError);
						expect(err).to.have.property('validator').equal('match');
						expect(err).to.have.property('message').equal('Must be a string of letters from a to z.');
						expect(err).to.have.property('keyPath').of.length(0);
						done();
					});
				});
			});
		});
		describe('enum', function() {
			it ('should come back with an error if string is not in enum.', function(done) {
				isvalid('123', { type: String, enum: ['this','is','a','test'] }, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('enum');
					expect(err).to.have.property('message').equal('Possible values are "this", "is", "a" and "test".');
					expect(err).to.have.property('keyPath').of.length(0);
					done();
				});
			});
			it ('should come back with no error if string is in enum.', function(done) {
				isvalid('test', { type: String, enum: ['this','is','a','test'] }, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.be.a('String').equal('test');
					done();
				});
			});
			describe('#errors', function() {
				it ('should come back with an error of custom message if string is not in enum.', function(done) {
					isvalid('123', {
						type: String,
						enum: ['this','is','a','test'],
						errors: {
							enum: 'Must be a word from the sentence "this is a test".'
						}
					}, function(err, validData) {
						expect(err).to.be.instanceof(ValidationError);
						expect(err).to.have.property('validator').equal('enum');
						expect(err).to.have.property('message').equal('Must be a word from the sentence "this is a test".');
						expect(err).to.have.property('keyPath').of.length(0);
						done();
					});
				});
			});
		});
	});
	describe('number validator', function() {
		commonTests.all(Number, 123, []);
		it ('should come back with no error and input same as output if number is supplied.', function(done) {
			isvalid(123, Number, function(err, validData) {
				expect(err).to.be.null;
				expect(validData).to.equal(123);
				done();
			});
		});
		describe('range', function() {
			it ('should come back with error if input is not within range.', function(done) {
				isvalid(1, { type: Number, range: '2-4' }, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('range');
					expect(err).to.have.property('message').equal('Not within range of 2-4');
					expect(err).to.have.property('keyPath').of.length(0);
					done();
				});
			});
			it ('should come back with no error and output same as input if within range.', function(done) {
				isvalid(3, { type: Number, range: '2-4' }, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.equal(3);
					done();
				});
			});
			describe('#errors', function() {
				it ('should come back with error of custom message if input is not within range.', function(done) {
					isvalid(1, {
						type: Number,
						range: '2-4',
						errors: {
							range: 'Must be between 2 and 4.'
						}
					}, function(err, validData) {
						expect(err).to.be.instanceof(ValidationError);
						expect(err).to.have.property('validator').equal('range');
						expect(err).to.have.property('message').equal('Must be between 2 and 4.');
						expect(err).to.have.property('keyPath').of.length(0);
						done();
					});
				});
			});
		});
	});
	describe('date validator', function() {
		commonTests.all(Date, new Date(), 123);
	});
});
