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
	}
}