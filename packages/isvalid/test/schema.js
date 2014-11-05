var expect = require('chai').expect,
	schema = require('../lib/schema.js'),
	SchemaError = require('../lib/errors/schemaError.js');

describe('schema', function() {
	describe('#formalize', function() {
		it ('should throw an error if array shortcut contains no object', function() {
			expect(function() {
				schema.formalize([])
			}).to.throw(SchemaError);
		});
		it ('should throw an error if both type and custom is set', function() {
			expect(function() {
				schema.formalize({ type: String, custom: function() {} });
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
	});
});
