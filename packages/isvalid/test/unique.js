var expect = require('chai').expect,
	unique = require('../lib/unique.js');

describe('unique', function() {
	describe('#test()', function() {
		it ('should return false if not both objects are set', function() {
			expect(unique.equals(1, null)).to.equal(false);
		});
		it ('should return false if objects are not of same type', function() {
			expect(unique.equals(1, '1')).to.equal(false);
		});
		it ('should return true if strings are the same', function() {
			expect(unique.equals('This is a string', 'This is a string')).to.equal(true);
		});
		it ('should return true when two objects are the same', function() {
			expect(unique.equals({
				awesome: true
			},{
				awesome: true
			})).to.equal(true);
		});
		it ('should return false when two object are not the same', function() {
			expect(unique.equals({
				awesome: true
			}, {
				awesome: false
			})).to.equal(false);
		});
		it ('should return true if two arrays are the same', function() {
			expect(unique.equals(['This','is','an','array'], ['This','is','an','array'])).to.equal(true);
		});
		it ('should return false if two arrays are not the same', function() {
			expect(unique.equals(['This','is','an','array'], ['This','is','another','array'])).to.equal(false);
		});
		it ('should return true if two object with two arrays are all the same', function() {
			expect(unique.equals({
				obj: ['This','is','an','array']
			}, {
				obj: ['This','is','an','array']
			})).to.equal(true);
		});
		it ('should return false if two object with two arrays are not the same', function() {
			expect(unique.equals({
				obj: ['This','is','an','array']
			}, {
				obj: ['This','is','another','array']
			})).to.equal(false);
		});
	});
});
