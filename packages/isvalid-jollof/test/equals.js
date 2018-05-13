/*jshint expr: true*/
'use strict';

var expect = require('chai').expect,
	equals = require('../lib/equals.js');

describe('equals', function() {
	it ('should return false if data is not of the same type (null).', function(done) {
		equals(1, null, function(res) {
			expect(res).to.be.false;
			done();
		});
	});
	it ('should return false if data is not of the same type.', function(done) {
		equals(1, '1', function(res) {
			expect(res).to.be.false;
			done();
		});
	});
	it ('should return true if strings are equal.', function(done) {
		equals('This is a string', 'This is a string', function(res) {
			expect(res).to.be.true;
			done();
		});
	});
	it ('should return false if string are equal', function(done) {
		equals('This is a string', 'This is another string', function(res) {
			expect(res).to.be.false;
			done();
		});
	});
	it ('should return true if numbers are equal.', function(done) {
		equals(1, 1, function(res) {
			expect(res).to.be.true;
			done();
		});
	});
	it ('should return false if numbers are not equal.', function(done) {
		equals(1, 2, function(res) {
			expect(res).to.be.false;
			done();
		});
	});
	it ('should return true if booleans are equal.', function(done) {
		equals(false, false, function(res) {
			expect(res).to.be.true;
			done();
		});
	});
	it ('should return false if booleans are not equal.', function(done) {
		equals(true, false, function(res) {
			expect(res).to.be.false;
			done();
		});
	});
	it ('should return true if dates are equal.', function(done) {
		var d = new Date();
		equals(d, d, function(res) {
			expect(res).to.be.true;
			done();
		});
	});
	it ('should return false if dates are not equal.', function(done) {
		var d1 = new Date();
		var d2 = new Date();
		d2.setYear(d2.getFullYear() + 1);
		equals(d1, d2, function(res) {
			expect(res).to.be.false;
			done();
		});
	});
	it ('should return true if objects are equal.', function(done) {
		equals({
			awesome: true
		}, {
			awesome: true
		}, function(res) {
			expect(res).to.be.true;
			done();
		});
	});
	it ('should return false if object are not equal.', function(done) {
		equals({
			awesome: true
		}, {
			awesome: false
		}, function(res) {
			expect(res).to.be.false;
			done();
		});
	});
	it ('should return true if arrays are equal.', function(done) {
		equals(['This','is','an','array'], ['This','is','an','array'], function(res) {
			expect(res).to.be.true;
			done();
		});
	});
	it ('should return false if arrays are not equal.', function(done) {
		equals(['This','is','an','array'], ['This','is','another','array'], function(res) {
			expect(res).to.be.false;
			done();
		});
	});
	it ('should return true if objects with arrays are equal.', function(done) {
		equals({
			obj: ['This','is','an','array']
		}, {
			obj: ['This','is','an','array']
		}, function(res) {
			expect(res).to.be.true;
			done();
		});
	});
	it ('should return false if objects with arrays are not equal.', function(done) {
		equals({
			obj: ['This','is','an','array']
		}, {
			obj: ['This','is','another','array']
		}, function(res) {
			expect(res).to.be.false;
			done();
		});
	});
});
