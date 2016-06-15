'use strict';

var expect = require('chai').expect,
	should = require('chai').should(),
	ranges = require('../lib/ranges.js');

describe('ranges', function() {
	it ('should throw an error if ranges is not a string.', function() {
		expect(function() {
			ranges.testIndex([123], 1);
		}).to.throw(Error);
	});
	it ('should throw no error if ranges is a number.', function() {
		expect(function() {
			ranges.testIndex(1, 1);
		}).not.to.throw(Error);
	});
	it ('should throw error if ranges is string but format is invalid.', function() {
		expect(function() {
			ranges.testIndex('abc', 1);
		}).to.throw(Error);
	});
	it ('should throw error if index is not set.', function() {
		expect(function() {
			ranges.testIndex(1);
		});
	});
	it ('should return true if index is within range.', function() {
		expect(ranges.testIndex('-2,4-6,8,10-', 2)).to.equal(true);
	});
	it ('should return false if index is not within range.', function() {
		expect(ranges.testIndex('-2,4-6,8,10-', 3)).to.equal(false);
	});
});
