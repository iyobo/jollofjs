var chai = require('chai'),
	expect = chai.expect,
	ValidationError = require('../lib/error.js'),
	validate = require('../index.js');

chai.use(function(_chai, utils) {
	var Assertion = chai.Assertion;
	utils.addProperty(Assertion.prototype, 'validationError', function() {
		var err = utils.flag(this, 'object');
		new Assertion(err).to.have.property('keyPath').to.be.an('Array');
		new Assertion(err).to.have.property('schema').to.be.an('Object');
		new Assertion(err).to.have.property('schema').to.be.an('Object');
		new Assertion(err).to.have.property('message').to.be.a('String');
	});
});

describe('Validate', function() {
	describe('function', function() {
		describe('[input]', function() {
			it ('should throw an error if schema is not provided', function() {
				expect(function() {
					validate({}, undefined, undefined);
				}).to.throw(Error);
			});
			it ('should throw an error if callback is not provided', function() {
				expect(function() {
					validate({}, {}, undefined);
				}).to.throw(Error);
			});
			it ('should throw an error if schema type is unknown', function() {
				expect(function() {
					validate(null, { type: Error }, function() {});
				}).to.throw(Error);
			});
		});
		describe('[common validators]', function() {
			it ('should come back with error if object is required and object is not set.', function(done) {
				validate(undefined, { type: Object, required: true }, function(err, validObj) {
					expect(err).to.have.property('keyPath');
					expect(err).to.have.property('validator').equal('required');
					done();
				});
			});
			it ('should throw an error if schema is not of supported type', function() {
				expect(function() {
					validate(undefined, { type: RegExp });
				}).to.throw(Error);
			});
			it ('should call default if function is provided.', function(done) {
				validate(undefined, { type: Object, default: function(cb) {
					cb({ empty: true });
				} }, function(err, validObj) {
					expect(err).to.be.null;
					expect(validObj).to.have.property('empty').equals(true);
					done();
				});
			});
			it ('should come back with true when default value \'true\' is provided', function(done) {
				validate(undefined, { type: Object, default: { empty: true } }, function(err, validObj) {
					expect(err).to.be.null;
					expect(validObj).to.have.property('empty').equals(true);
					done();
				});
			})
		});
		describe('[Object validators]', function() {
			it ('should come back with error if input is not an object', function(done) {
				validate(123, {}, function(err, validObj) {
					expect(err).to.be.validationError;
					expect(err).to.have.property('validator').equal('type');
					done();
				});
			});
			it ('should come back with no error and validObj if object shortcut is empty.', function(done) {
				validate({}, {}, function(err, validObj) {
					expect(err).to.be.null;
					expect(validObj).to.be.a('Object');
					done();
				});
			});
			it ('should come out with same input as output if keys can validate.', function(done) {
				validate({
					awesome: true,
					why: 'It just is!'
				}, {
					awesome: { type: Boolean },
					why: { type: String }
				}, function(err, validObj) {
					expect(err).to.be.null;
					expect(validObj).to.have.property('awesome').equals(true);
					expect(validObj).to.have.property('why').equals('It just is!');
					done();
				});
			});
		});
		describe('[Array validators]', function() {
			it ('should come back with no error and an empty array when supplying empty array', function(done) {
				validate([], [{}], function(err, validObj) {
					expect(err).to.be.null;
					expect(validObj).to.have.length(0);
					done();
				});
			});
			it ('should come back with error if array length is not within ranges of len', function(done) {
				validate([], {
					type: Array,
					len: '2-',
					schema: {}
				}, function(err, validObj) {
					expect(err).to.be.validationError;
					expect(err).to.have.property('validator').equal('len');
					done();
				});
			});
			it ('should come back with error if unique is specified and array is not unique', function(done) {
				validate([{
					awesome: true
				},{
					awesome: true
				}], {
					type: Array,
					unique: true,
					schema: { awesome: { type: Boolean } }
				}, function(err, validObj) {
					expect(err).to.be.validationError;
					expect(err).to.have.property('validator').equal('unique');
					done();
				});
			});
			it ('should come back with no error if unique is specified and array is unique', function(done) {
				validate([{
					awesome: true
				},{
					awesome: false
				}], {
					type: Array,
					unique: true,
					schema: { awesome: { type: Boolean } }
				}, function(err, validObj) {
					expect(err).to.be.null;
					expect(validObj).to.have.length(2);
					done();
				});
			});
		});
		describe('[String validators]', function() {
			it ('should come back with error if string is not supplied.', function(done) {
				validate(123, { type: String }, function(err, validObj) {
					expect(err).to.be.validationError;
					expect(err).to.have.property('validator').equal('type');
					done();
				});
			});
			it ('should come back with trimmed string when trim is set to true', function(done) {
				validate('  123abc  ', { type: String, trim: true }, function(err, validObj) {
					expect(err).to.be.null;
					expect(validObj).to.equal('123abc');
					done();
				});
			});
			it ('should throw an error if schema match is not a RegExp.', function() {
				expect(function() {
					validate('123', { type: String, match: 'Not a RegExp' }, function() {});
				}).to.throw(Error);
			});
			it ('should come back with an error if string does not match RegExp', function(done) {
				validate('123', { type: String, match: /^[a-z]+$/ }, function(err, validObj) {
					expect(err).to.be.validationError;
					expect(err).to.have.property('validator').equal('match');
					done();
				});
			});
			it ('should come back with no error and validObj should match input string when match is specified and input matches', function(done) {
				validate('123', { type: String, match: /^[0-9]+$/ }, function(err, validObj) {
					expect(validObj).to.equal('123');
					done();
				});
			});
			it ('should come back with null and no error if input is not required and match is not defined', function(done) {
				validate(null, { type: String }, function(err, validObj) {
					expect(err).to.be.null;
					expect(validObj).to.be.null;
					done();
				});
			});
			it ('should come back with no error and output same as input if string is supplied', function(done) {
				validate('123', { type: String }, function(err, validObj) {
					expect(err).to.be.null;
					expect(validObj).to.equal('123');
					done();
				});
			});
		});
		describe('[Number validators]', function() {
			it ('should convert string values into numbers if string contains a number', function(done) {
				validate('123.0', { type: Number }, function(err, validObj) {
					expect(err).to.be.null;
					expect(validObj).to.equal(123.0);
					done();
				});
			});
			it ('should come back with error if input is not a number.', function(done) {
				validate('abc', { type: Number }, function(err, validObj) {
					expect(err).to.be.validationError;
					done();
				});
			});
			it ('should come back with no error and input same as output if number is supplied', function(done) {
				validate(123, { type: Number }, function(err, validObj) {
					expect(err).to.be.null;
					expect(validObj).to.equal(123);
					done();
				});
			});
			it ('should come back with error if string is supplied - but not a number', function(done) {
				validate('abc', { type: Number }, function(err, validObj) {
					expect(err).to.be.validationError;
					expect(err).to.have.property('validator').equal('type');
					done();
				});
			});
			it ('should come back with error if input is not within range', function(done) {
				validate(1, { type: Number, range: '2-4' }, function(err, validObj) {
					expect(err).to.be.validationError;
					expect(err).to.have.property('validator').equal('range');
					done();
				});
			});
			it ('should come back with no error and output same as input if within range', function(done) {
				validate(3, { type: Number, range: '2-4' }, function(err, validObj) {
					expect(err).to.be.null;
					expect(validObj).to.equal(3);
					done();
				});
			});
		});
		describe('[Boolean validators]', function() {
			it ('should come back with error if input is not a Boolean', function(done) {
				validate([], { type: Boolean }, function(err, validObj) {
					expect(err).to.be.validationError;
					expect(err).to.have.property('validator').equal('type');
					done();
				});
			});
			it ('should come back with no error and validObj set to true if input is string with \'True\'', function(done) {
				validate('True', { type: Boolean }, function(err, validObj) {
					expect(err).to.be.null;
					expect(validObj).to.equal(true);
					done();
				});
			});
			it ('should come back with no error and validObj set to false if input is string with \'False\'', function(done) {
				validate('False', { type: Boolean }, function(err, validObj) {
					expect(err).to.be.null;
					expect(validObj).to.equal(false);
					done();
				});
			});
		});
		describe('[Date validators]', function() {
			it ('should come back with error if input is not a Date', function(done) {
				validate([], { type: Date }, function(err, validObj) {
					expect(err).to.be.validationError;
					expect(err).to.have.property('validator').equal('type');
					done();
				});
			});
			it ('should come back with no error and validObj set to a Date if input is string with an ISO date', function(done) {
				validate('2014-10-19T02:24:42.395Z', { type: Date }, function(err, validObj) {
					expect(err).to.be.null;
					expect(validObj.getTime()).to.equal(new Date("2014-10-19T02:24:42.395Z").getTime());
					done();
				});
			});
		});
		describe('[custom validators]', function() {
			it ('should call function if custom is specified.', function(done) {
				validate({}, {
					custom: function(obj, schema, fn) {
						expect(obj).to.be.an('Object');
						expect(schema).to.have.property('custom');
						fn(null, obj);
					}
				}, function(err, validObj) {
					expect(validObj).to.be.an('Object');
					done();
				});
			});
			it ('should reformat err if custom is specified and returns an error', function(done) {
				validate({}, {
					custom: function(obj, schema, fn) {
						fn(new Error('This is an error'));
					}
				}, function(err, validObj) {
					expect(err).to.be.validationError;
					done();
				});
			});
			it ('should pass on custom schema options if specified', function(done) {
				validate({}, {
					custom: function(obj, schema, fn) {
						expect(schema).to.have.property('options').to.be.equal('test');
						fn();
					},
					options: 'test'
				}, function(err, validObj) {
					done();
				});
			});
		});
	});
});
