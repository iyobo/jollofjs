var chai = require('chai'),
	expect = chai.expect,
	assert = chai.assert,
	ValidationError = require('../lib/errors/validationError.js'),
	isvalid = require('../');

describe('validate', function() {
	it ('should throw an error if schema is not provided', function() {
		expect(function() {
			isvalid({}, undefined, undefined);
		}).to.throw(Error);
	});
	it ('should throw an error if callback is not provided', function() {
		expect(function() {
			isvalid({}, {}, undefined);
		}).to.throw(Error);
	});
	describe('type conversion', function() {
		it ('should convert string values into numbers if string contains a number', function(done) {
			isvalid('123.123', Number, function(err, validData) {
				expect(err).to.be.null;
				expect(validData).to.equal(123.123);
				done();
			});
		});
		it ('should come back with error if string is supplied - but not a number', function(done) {
			isvalid('abc', Number, function(err, validData) {
				expect(err).to.be.instanceof(ValidationError);
				expect(err).to.have.property('validator').equal('type');
				done();
			});
		});
		it ('should come back with no error and validData set to true if input is string with \'True\'', function(done) {
			isvalid('True', Boolean, function(err, validData) {
				expect(err).to.be.null;
				expect(validData).to.equal(true);
				done();
			});
		});
		it ('should come back with no error and validData set to false if input is string with \'False\'', function(done) {
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
		it ('should come back with no error and validData set to a Date if input is string with an ISO date', function(done) {
			isvalid('2014-10-19T02:24:42.395Z', Date, function(err, validData) {
				expect(err).to.be.null;
				expect(validData.getTime()).to.equal(new Date("2014-10-19T02:24:42.395Z").getTime());
				done();
			});
		});
		it ('should come back with error and if string is supplied - but not ISO date', function(done) {
			isvalid('19/10/14 2:24:42', Date, function(err, validData) {
				expect(err).to.be.instanceof(ValidationError);
				expect(err).to.have.property('validator').equal('type');
				done();
			});
		});
	});
	describe('common validator', function() {
		describe('type', function() {
			it ('should come back with error if input is not an Object', function(done) {
				isvalid(123, {}, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('type');
					done();
				});
			});
			it ('should come back with error if input is not an Array', function(done) {
				isvalid(123, [{}], function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('type');
					done();
				});
			});
			it ('should come back with error if input is not a String.', function(done) {
				isvalid(123, String, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('type');
					done();
				});
			});
			it ('should come back with error if input is not a Number.', function(done) {
				isvalid('abc', Number, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('type');
					done();
				});
			});
			it ('should come back with error if input is not a Boolean', function(done) {
				isvalid([], Boolean, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('type');
					done();
				});
			});
			it ('should come back with error if input is not a Date', function(done) {
				isvalid([], Date, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('type');
					done();
				});
			});
		});
		describe('required', function() {
			it ('should come back with error if object is required and object is not set.', function(done) {
				isvalid(undefined, { type: Object, required: true }, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('required');
					done();
				});
			});
			it ('should come back with error if object is required through options', function(done) {
				isvalid(undefined, { type: Object }, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equals('required');
					done();
				}, { required: true });
			});
			it ('should come back with no error if input is undefined and not required', function(done) {
				isvalid(undefined, {}, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.be.undefined;
					done();
				});
			});
		});
		describe('default', function() {
			it ('should call default if function with callback is provided.', function(done) {
				isvalid(undefined, { type: Object, default: function(cb) {
					cb({ empty: true });
				} }, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.have.property('empty').equals(true);
					done();
				});
			});
			it ('should call default if function with no callback is provided', function(done) {
				isvalid(undefined, { type: Object, default: function() {
					return { empty: true }
				} }, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.have.property('empty').equals(true);
					done();
				});
			});
			it ('should come back with true when default value \'true\' is provided', function(done) {
				isvalid(undefined, { type: Object, default: { empty: true } }, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.have.property('empty').equals(true);
					done();
				});
			});
		});
		describe('allowNull', function() {
			it ('should come back with error if null and null is not allowed', function(done) {
				isvalid(null, String, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('allowNull');
					done();
				});
			});
			it ('should come back with no error if null and null is allowed', function(done) {
				isvalid(null, { type: String, allowNull: true, required: true }, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.be.null;
					done();
				});
			});
		});
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
			it ('should call function if synchronous custom is specified', function(done) {
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
			it ('should convert errors thrown in synchronous custom function', function(done) {
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
			it ('should return original object if synchronous function doesn\'t return', function(done) {
				isvalid('test', {
					custom: function(obj, schema) {}
				}, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.be.a('String').equal('test');
					done();
				});
			});
			it ('should reformat err if custom is specified and returns an error', function(done) {
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
			it ('should pass on custom schema options if specified', function(done) {
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
			it ('should first validate using validators and then custom', function(done) {
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
			it ('should call all custom validators in array', function(done) {
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
			it ('should come back with error if thrown underway', function(done) {
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
	});
	describe('object validator', function() {
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
			it ('should come back with unknown keys intact if unknownKeys is provided as \'allow\' in options', function(done) {
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
					done();
				});
			});
			it ('should come back with keys removed if unknown keys and unknownKeys is set to \'remove\'', function(done) {
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
		});
		describe('allowUnknownKeys [deprecated]', function() {
			it ('should come back with old validator name in error if allowUnknownKeys was converted to unknownKeys', function(done) {
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
						'allowUnknownKeys': 'old value'
					}
				}, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('allowUnknownKeys');
					expect(err.message).to.equal('old value');
					done();
				});
			});
		});
	});
	describe('array validator', function() {
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
		it ('should come back with no error and an empty array when supplying empty array', function(done) {
			isvalid([], [{}], function(err, validData) {
				expect(err).to.be.null;
				expect(validData).to.have.length(0);
				done();
			});
		});
		describe('len', function() {
			it ('should come back with error if array length is not within ranges of len', function(done) {
				isvalid([], {
					type: Array,
					len: '2-',
					schema: {}
				}, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('len');
					done();
				});
			});
		});
		describe('unique', function() {
			it ('should come back with error if array of objects is not unique', function(done) {
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
					done();
				});
			});
			it ('should come back with error if array of objects is not unique', function(done) {
				isvalid([{
					awesome: true
				},{
					awesome: false
				}], {
					type: Array,
					unique: true,
					schema: { awesome: Boolean }
				}, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.have.length(2);
					done();
				});
			});
			it ('should come back with error if array of strings is not unique', function(done) {
				isvalid(['This', 'is', 'an', 'array', 'array'], {
					type: Array,
					unique: true,
					schema: String
				}, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('unique');
					done();
				});
			});
			it ('should come back with no error if array of strings is unique', function(done) {
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
			it ('should come back with error if array of numbers is not unique', function(done) {
				isvalid([1, 2, 3, 4, 4], {
					type: Array,
					unique: true,
					schema: Number
				}, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('unique');
					done();
				});
			});
			it ('should come back with no error if array of numbers is unique', function(done) {
				isvalid([1, 2, 3, 4], {
					type: Array,
					unique: true,
					schema: Number
				}, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.have.length(4);
					done();
				});
			});
		});
	});
	describe('string validator', function() {
		it ('should come back with no error and input same as outout if string is supplied.', function(done) {
			isvalid('123', String, function(err, validData) {
				expect(err).to.be.null;
				expect(validData).to.be.a('String').equals('123');
				done();
			});
		});
		describe('trim', function() {
			it ('should come back with trimmed string when trim is set to true', function(done) {
				isvalid('  123abc  ', { type: String, trim: true }, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.equal('123abc');
					done();
				});
			});
			it ('should come back with trimmed string when trim option is true', function(done) {
				isvalid('  123abc  ', String, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.equal('123abc');
					done();
				}, { trim: true });
			});
		});
		describe('match', function() {
			it ('should come back with an error if string does not match RegExp', function(done) {
				isvalid('123', { type: String, match: /^[a-z]+$/ }, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('match');
					done();
				});
			});
			it ('should come back with no error and validData should match input string when match is specified and input matches', function(done) {
				isvalid('123', { type: String, match: /^[0-9]+$/ }, function(err, validData) {
					expect(validData).to.equal('123');
					done();
				});
			});
		});
		describe('enum', function() {
			it ('should come back with an error if string is not in enum', function(done) {
				isvalid('123', { type: String, enum: ['this','is','a','test'] }, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('enum');
					done();
				});
			});
			it ('should come back with no error if string is in enum', function(done) {
				isvalid('test', { type: String, enum: ['this','is','a','test'] }, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.be.a('String').equal('test');
					done();
				});
			});
		});
	});
	describe('number validator', function() {
		it ('should come back with no error and input same as output if number is supplied', function(done) {
			isvalid(123, Number, function(err, validData) {
				expect(err).to.be.null;
				expect(validData).to.equal(123);
				done();
			});
		});
		describe('range', function() {
			it ('should come back with error if input is not within range', function(done) {
				isvalid(1, { type: Number, range: '2-4' }, function(err, validData) {
					expect(err).to.be.instanceof(ValidationError);
					expect(err).to.have.property('validator').equal('range');
					done();
				});
			});
			it ('should come back with no error and output same as input if within range', function(done) {
				isvalid(3, { type: Number, range: '2-4' }, function(err, validData) {
					expect(err).to.be.null;
					expect(validData).to.equal(3);
					done();
				});
			});
		});
	});
});
