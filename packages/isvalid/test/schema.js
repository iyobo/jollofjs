var expect = require('chai').expect,
	schema = require('../lib/schema.js');

describe('schema', function() {
	describe('#formalize', function() {
		it ('should throw an error if array shortcut contains no objects', function() {
			expect(function() {
				schema.formalize([]);
			}).to.throw(Error);
		});
		it ('should come back with an object shortcut expanded', function() {
			var s = schema.formalize({});
			expect(s).to.have.property('type');
			expect(s).to.have.property('schema').to.be.an('Object')
		});
		it ('should come back with an array shortcut expanded', function() {
			var s = schema.formalize([{}]);
			expect(s).to.have.property('type');
			expect(s).to.have.property('schema').to.be.an('Object')
		});
		it ('should come back with required set to true if object has not specified required and a nested subschema is required.', function() {
			var s = schema.formalize({
				'a': { type: String, required: true }
			});
			expect(s).to.have.property('required').to.be.equal(true);
		});
		it ('should come back with required set to true if any deep subschema is required.', function() {
			var s = schema.formalize({
				'a': {
					type: Object,
					required: 'implicit',
					schema: {
						'b': { type: String, required: true }
					}
				}
			});
			expect(s).to.have.property('required').to.be.equal(true);
		});
		it ('should come back with required set to false if root object required is false and deep subschema is required.', function() {
			var s = schema.formalize({
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
			});
			expect(s).to.have.property('required').to.be.equal(false);
		});
		it ('should come back with required set to true if array has deep nested required subschema', function() {
			var s = schema.formalize([{ type: String, required: true }]);
			expect(s).to.have.property('required').to.be.equal(true);
		});
		it ('should come back with required set to false if array is non-required but has deep nested required subschema', function() {
			var s = schema.formalize({
				type: Array,
				required: false,
				schema: {
					'a': { type: String, required: true }
				}
			});
			expect(s).to.have.property('required').to.be.equal(false);
		});
	});
});
