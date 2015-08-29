var expect = require('chai').expect,
  unique = require('../lib/unique.js');

describe('unique', function() {
	it ('should return false if array is not unique', function(done) {
		unique([1,1], function(res) {
			expect(res).to.be.false;
			done();
		});
	});
	it ('shold return true if array is unique', function(done) {
		unique([{test:{ing:123}},{test:{ing:456}}], function(res) {
			expect(res).to.be.true;
			done();
		});
	})
});
