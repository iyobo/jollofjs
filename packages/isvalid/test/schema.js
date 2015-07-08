var expect = require('chai').expect,
	schema = require('../lib/schema.js'),
	SchemaError = require('../lib/errors/schemaError.js');

describe('schema', function() {
	describe('#formalize', function() {
		it ('should throw an error if array shortcut contains no object', function() {
			expect(function() {
				schema.formalize([]);
			}).to.throw(SchemaError);
		});
		it ('should throw an error if schema is garbage value', function() {
			expect(function() {
				schema.formalize(123);
			}).to.throw(SchemaError);
		});
		it ('should come back with an object shortcut expanded', function(done) {
			schema.formalize({}, function(s) {
				expect(s).to.have.property('type');
				expect(s).to.have.property('schema').to.be.an('Object');
				done();
			});
		});
		it ('should come back with an array shortcut expanded', function(done) {
			schema.formalize([{}], function(s) {
				expect(s).to.have.property('type');
				expect(s).to.have.property('schema').to.be.an('Object');
				done();
			});
		});
		it ('should come back with required set to true if object has not specified required and a nested subschema is required.', function(done) {
			schema.formalize({
				'a': { type: String, required: true }
			}, function(s) {
				expect(s).to.have.property('required').to.be.equal(true);
				done();
			});
		});
		it ('should come back with required set to true if any deep subschema is required.', function(done) {
			schema.formalize({
				'a': {
					'b': {
						'c': { type: String, required: true }
					}
				}
			}, function(s) {
				expect(s).to.have.property('required').to.be.equal(true);
				done();
			});
		});
		it ('should come back with required set to false if root object required is false and deep subschema is required.', function(done) {
			schema.formalize({
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
				done();
			});
		});
		it ('should come back with required set to true if array has deep nested required subschema', function(done) {
			schema.formalize([{ type: String, required: true }], function(s) {
				expect(s).to.have.property('required').to.be.equal(true);
				done();
			});
		});
		it ('should come back with required set to false if array is non-required but has deep nested required subschema', function(done) {
			schema.formalize({
				type: Array,
				required: false,
				schema: {
					'a': { type: String, required: true }
				}
			}, function(s) {
				expect(s).to.have.property('required').to.be.equal(false);
				done();
			});
		});
		it ('should come back with an object with both keys formalized', function(done) {
			schema.formalize({
				'a': { type: String, required: true },
				'b': { type: String, required: true }
			}, function(s) {
				expect(s).to.have.property('schema');
				done();
			});
		});
		it ('should throw error if type is String and match is non-RegExp', function() {
			expect(function() {
				schema.formalize({ type: String, match: 'test' });
			}).to.throw(SchemaError);
		});
		it ('should throw error if type is String and enum is not an array', function() {
			expect(function() {
				schema.formalize({ type: String, enum: 1 });
			}).to.throw(SchemaError);
		});
		it ('should throw error if type is String and enum has zero valus', function() {
			expect(function() {
				schema.formalize({ type: String, enum: [] });
			}).to.throw(SchemaError);
		});
		it ('should throw error if type is String and enum is not array of strings', function() {
			expect(function() {
				schema.formalize({ type: String, enum: ['this','is',1,'test'] });
			}).to.throw(SchemaError);
		});
		it ('should come back with no error and match set if match is RegExp', function(done) {
			schema.formalize({ type: String, match: /test/ }, function(schema) {
				expect(schema).to.have.property('match');
				done();
			});
		});
		it ('should throw an error if schema type is unknown', function() {
			expect(function() {
				schema.formalize({ type: Error });
			}).to.throw(SchemaError);
		});
		it ('should throw an error if schema is not of supported type', function() {
			expect(function() {
				schema.formalize({ type: RegExp });
			}).to.throw(Error);
		});
	});
});
