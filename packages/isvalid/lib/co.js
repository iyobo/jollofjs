var isvalid = require('./validate.js');

exports = module.exports = function(data, schema, keyPath, options) {
	return function (fn) {
		return isvalid(data, schema, fn, keyPath, options);
	};
};
