'use strict';

var objectEquals = function(obj1, obj2, fn) {

	var keys = Object.keys(obj1);

	arrayEquals(Object.keys(obj1), Object.keys(obj2), function(res) {

		if (!res) return fn(false);

		(function testNext(idx) {
			if (idx == keys.length) return fn(true);
			var key = keys[idx];
			equals(obj1[key], obj2[key], function(res) {
				if (!res) return fn(false);
				setImmediate(testNext, idx + 1);
			});
		})(0);

	});

};

var arrayEquals = function(obj1, obj2, fn) {

	if (obj1.length != obj2.length) return fn(false);

	var o1 = obj1.sort();
	var o2 = obj2.sort();

	(function testNext(idx) {
		if (idx == o1.length) return fn(true);
		equals(o1[idx], o2[idx], function(res) {
			if (!res) return fn(false);
			setImmediate(testNext, idx + 1);
		});
	})(0);

};

var equals = function(obj1, obj2, fn) {

	if ((obj1 && !obj2) || (!obj1 && obj2)) return fn(false);
	if (typeof obj1 !== typeof obj2) return fn(false);

	if (typeof obj1 === 'object') {
		if (obj1.constructor.name === 'Object') return objectEquals(obj1, obj2, fn);
		if (obj1.constructor.name === 'Array') return arrayEquals(obj1, obj2, fn);
	}

	return fn(obj1 == obj2);

};

exports = module.exports = equals;
