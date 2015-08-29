var expect = require('chai').expect;
	equals = require('../lib/equals.js');

describe('equals', function() {
	it ('should return false if not both objects are set', function(done) {
		equals(1, null, function(res) {
			expect(res).to.be.false;
			done();
		});
	});
	it ('should return false if objects are not of same type', function(done) {
		equals(1, '1', function(res) {
			expect(res).to.be.false;
			done();
		});
	});
	it ('should return true if strings are the same', function(done) {
		equals('This is a string', 'This is a string', function(res) {
			expect(res).to.be.true;
			done();
		});
	});
	it ('should return true when two objects are the same', function(done) {
		equals({
			awesome: true
		}, {
			awesome: true
		}, function(res) {
			expect(res).to.be.true;
			done();
		});
	});
	it ('should return false when two object are not the same', function(done) {
		equals({
			awesome: true
		}, {
			awesome: false
		}, function(res) {
			expect(res).to.be.false;
			done();
		});
	});
	it ('should return true if two arrays are the same', function(done) {
		equals(['This','is','an','array'], ['This','is','an','array'], function(res) {
			expect(res).to.be.true;
			done();
		});
	});
	it ('should return false if two arrays are not the same', function(done) {
		equals(['This','is','an','array'], ['This','is','another','array'], function(res) {
			expect(res).to.be.false;
			done();
		});
	});
	it ('should return true if two object with two arrays are all the same', function(done) {
		equals({
			obj: ['This','is','an','array']
		}, {
			obj: ['This','is','an','array']
		}, function(res) {
			expect(res).to.be.true;
			done();
		});
	});
	it ('should return false if two object with two arrays are not the same', function(done) {
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
