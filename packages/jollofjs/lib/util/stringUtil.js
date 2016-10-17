module.exports = {
	/**
	 * Takes in a camelCase string and Returns a string fit enough to be used as a label
	 * @param str e.g. 'firstName', 'toJSONString', 'address2'
	 * @returns {String} e.g. 'First Name', 'To JSON String', 'Address 2'
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