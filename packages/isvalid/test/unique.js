/*jshint expr: true*/
'use strict';

var expect = require('chai').expect,
	unique = require('../lib/unique.js');

describe('unique', function() {
	it ('shold return false if array of objects is not unique.', function(done) {
		unique([{test:{ing:123}},{test:{ing:123}}], function(res) {
			expect(res).to.be.false;
			done();
		});
	});
	it ('shold return true if array of objects is unique.', function(done) {
		unique([{test:{ing:123}},{test:{ing:456}}], function(res) {
			expect(res).to.be.true;
			done();
		});
	});
});
