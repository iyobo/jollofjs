const requireDir = require('require-dir');
const fs = require('fs')
const co = require('co')

module.exports = {
	/**
	 * Stores a file depending on app-specified file storage engine
	 * @param str
	 * @returns {*}
	 */
	labelize: function (str) {
		return str.replace
		(/(^[a-z]+)|[0-9]+|[A-Z][a-z]+|[A-Z]+(?=[A-Z][a-z]|[0-9])/g
			, function (match, first) {
				if (first) match = match[0].toUpperCase() + match.substr(1);
				return match + ' ';
			}
		)
	},

	/**
	 * RequireDir only if path actually exists.
	 * @param path
	 * @param opts
	 */
	requireDirOptional: function (path, opts) {

		if (fs.existsSync(path)) {
			requireDir(path, opts);
		}
	},

	/**
	 * Returns the first existing path from an array of paths.
	 * This is a blocking function.
	 * @param arr
	 */
	firstExistingPath: function (arr) {
		for (let i in arr) {

			if (fs.existsSync(arr[i])) return arr[i];
		}
	}
}