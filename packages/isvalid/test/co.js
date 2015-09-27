var co = require('../lib/co.js');
var expect = require('chai').expect;

describe('co', function() {

	it ('should come back with function', function() {
		expect(co({}, {})).to.be.a.function;
	});

	it ('should validate', function(done) {
		co({}, {})(function(err, validObj) {
			expect(err).to.be.null;
			expect(validObj).to.be.an.object;
			done();
		});
	});

});
