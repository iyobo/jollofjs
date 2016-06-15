'use strict';

var equals = require('./equals.js');

exports = module.exports = function(arr, fn) {

	if (arr.length <= 1) return fn(true);

	(function testNext(idx1, idx2) {
		if (idx2 == arr.length) {
			idx1++;
			idx2 = idx1 + 1;
		}
		if (idx2 == arr.length) return fn(true);
		equals(arr[idx1], arr[idx2], function(res) {
			if (res) return fn(false);
			setImmediate(testNext, idx1, idx2 + 1);
		});
	})(0, 1);

};
