/**
 * Created by iyobo on 2016-10-29.
 */
var _ = require("lodash")
var s = require("util").format

exports.register = function (validateModule) {
	if (!validateModule) validateModule = require("validate.js");

	var val = function (value, options, key, attributes) {
		var validateElement = function (element) {
			return validateModule(element, options)
		}
		var validations = _.chain(value).map(validateElement).filter().value()
		if (_.isEmpty(validations)) return
		return s("element %j does not validate: %j", value, validations)
	}

	var async = function (args) {
		args = arguments
		return new validateModule.Promise(function (resolve, reject) {
			var result = val.apply(this, args)
			resolve(result)
		})
	}

	validateModule.validators.array = val
	validateModule.validators.arrayAsync = async
}