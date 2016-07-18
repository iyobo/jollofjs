'use strict';

var expect = require('chai').expect,
	formalize = require('../lib/schema.js').formalize,
	SchemaError = require('../lib/errors/SchemaError.js');

var testSyncAndAsync = function(desc, s, expects) {
	it ('[async] ' + desc, function(done) {
		formalize(s, function(s) {
			expects(s);
			done();
		});
	});
	it ('[sync]	' + desc, function() {
		s = formalize(s);
		expects(s);
	});
};

describe('schema', function() {
	describe('formalizer', function() {
		it ('should throw an error if array shortcut contains no object.', function() {
			expect(function() {
				formalize([]);
			}).to.throw(SchemaError);
		});
		it ('should throw an error if schema is garbage value.', function() {
			expect(function() {
				formalize(123);
			}).to.throw(SchemaError);
		});
		it ('should throw error if required is not a String or Boolean.', function() {
			expect(function() {
				formalize({ type: String, required: 123 });
			}).to.throw(SchemaError);
		});
		it ('should throw error if required is a String but not \'implicit\'.', function() {
			expect(function() {
				formalize({ type: String, required: 'test' });
			}).to.throw(SchemaError);
		});
		it ('should throw error if type is String and match is non-RegExp.', function() {
			expect(function() {
				formalize({ type: String, match: 'test' });
			}).to.throw(SchemaError);
		});
		it ('should throw error if type is String and enum is not an array.', function() {
			expect(function() {
				formalize({ type: String, enum: 1 });
			}).to.throw(SchemaError);
		});
		it ('should throw error if type is String and enum has zero valus.', function() {
			expect(function() {
				formalize({ type: String, enum: [] });
			}).to.throw(SchemaError);
		});
		it ('should throw error if type is String and enum is not array of strings.', function() {
			expect(function() {
				formalize({ type: String, enum: ['this','is',1,'test'] });
			}).to.throw(SchemaError);
		});
		it ('should throw an error if schema type is unknown.', function() {
			expect(function() {
				formalize({ type: Error });
			}).to.throw(SchemaError);
		});
		it ('should throw an error if schema is not of supported type.', function() {
			expect(function() {
				formalize({ type: RegExp });
			}).to.throw(SchemaError);
		});
		it ('should throw an error if unknownKeys is not \'allow\', \'deny\' or \'remove\'.', function() {
			expect(function() {
				formalize({ type: Object, unknownKeys: 'test' });
			}).to.throw(SchemaError);
		});
		it ('should throw an error if array schema is unknown type.', function() {
			expect(function() {
				formalize({ type: Array, schema: RegExp });
			}).to.throw(SchemaError);
		});
		it ('should throw an error if object schema is unknown type.', function() {
			expect(function() {
				formalize({ type: Object, schema: RegExp });
			}).to.throw(SchemaError);
		});
		testSyncAndAsync ('should come back with an object shortcut expanded.', {}, function(s) {
			expect(s).to.have.property('type');
			expect(s).to.have.property('schema').to.be.an('Object');
		});
		testSyncAndAsync ('should come back with an array shortcut expanded.', [{}], function(s) {
			expect(s).to.have.property('type');
			expect(s).to.have.property('schema').to.be.an('Object');
		});
		testSyncAndAsync ('should come back with an Object shortcut expanded.', Object, function(s) {
			expect(s).to.have.property('type').equal(Object);
		});
		testSyncAndAsync ('should come back with an Array shortcut expanded.', Array, function(s) {
			expect(s).to.have.property('type').equal(Array);
		});
		testSyncAndAsync ('should come back with a String shortcut expanded.', String, function(s) {
			expect(s).to.have.property('type').equal(String);
		});
		testSyncAndAsync ('should come back with a Number shortcut expanded.', Number, function(s) {
			expect(s).to.have.property('type').equal(Number);
		});
		testSyncAndAsync ('should come back with a Boolean shortcut expanded.', Boolean, function(s) {
			expect(s).to.have.property('type').equal(Boolean);
		});
		testSyncAndAsync ('should come back with a Date shortcut expanded.', Date, function(s) {
			expect(s).to.have.property('type').equal(Date);
		});
		testSyncAndAsync ('should come back with required set to true if object has not specified required and a nested subschema is required.', {
			'a': { type: String, required: true }
		}, function(s) {
			expect(s).to.have.property('required').to.be.equal(true);
		});
		testSyncAndAsync ('should come back with required set to true if any deep subschema is required.', {
			'a': {
				'b': {
					'c': { type: String, required: true }
				}
			}
		}, function(s) {
			expect(s).to.have.property('required').to.be.equal(true);
		});
		testSyncAndAsync ('should come back with required set to true if root object has required in sub-schema.', {
			'a': { type: String, required: true }
		}, function(s) {
			expect(s).to.have.property('required').to.be.equal(true);
		});
		testSyncAndAsync ('should come back with required set to false if root object required is false and deep subschema is required.', {
			type: Object,
			required: false,
			schema: {
				'a': {
					type: Object,
					required: 'implicit',
					schema: {
						'a': { type: String, required: true }
					}
				}
			}
		}, function(s) {
			expect(s).to.have.property('required').to.be.equal(false);
		});
		testSyncAndAsync ('should come back with required set to true if array has deep nested required subschema.', [
			{ type: String, required: true }
		], function(s) {
			expect(s).to.have.property('required').to.be.equal(true);
		});
		testSyncAndAsync ('should come back with required set to false if array is non-required but has deep nested required subschema.', {
			type: Array,
			required: false,
			schema: {
				'a': { type: String, required: true }
			}
		}, function(s) {
			expect(s).to.have.property('required').to.be.equal(false);
		});
		testSyncAndAsync ('should come back with an object with both keys formalized.', {
			'a': { type: String, required: true },
			'b': { type: String, required: true }
		}, function(s) {
			expect(s).to.have.property('schema');
		});
		testSyncAndAsync ('should come back with no error and match set if match is RegExp.', { type: String, match: /test/ }, function(s) {
			expect(s).to.have.property('match');
		});
		testSyncAndAsync ('should come back with custom wrapped in an array.', { custom: function() {} }, function(s) {
			expect(s).to.have.property('custom').to.be.an('array');
		});
		testSyncAndAsync ('should come back with custom as an array.', { custom: [ function() {} ] }, function(s) {
			expect(s).to.have.property('custom').to.be.an('array');
		});
		testSyncAndAsync ('should come back with errors set on the errors key.', {
			type: [Boolean, 'Boolean.'],
			required: [true, 'Required.']
		}, function(s) {
			expect(s).to.have.property('type').equal(Boolean);
			expect(s).to.have.property('required').equal(true);
			expect(s).to.have.property('errors').be.an('object');
			expect(s.errors).to.have.property('type').equal('Boolean.');
			expect(s.errors).to.have.property('required').equal('Required.');
		});
		describe('allowUnknownKeys [deprecated]', function() {
			testSyncAndAsync ('should come back with unknownKeys set to \'allow\' if allowUnknownKeys is \'true\'.', {
				type: Object,
				allowUnknownKeys: true
			}, function(s) {
				expect(s.unknownKeys).to.equal('allow');
			});
			testSyncAndAsync ('should come back with unknownKeys set to \'deny\' if allowUnknownKeys is \'false\'.', {
				type: Object,
				allowUnknownKeys: false
			}, function(s) {
				expect(s.unknownKeys).to.equal('deny');
			});
		});
	});
});
