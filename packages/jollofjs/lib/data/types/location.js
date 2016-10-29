const registry = require('../registry');
const joi = require('joi');
/**
 * This is an in-built Schema Type.
 * Schema Types are schemas themselves, and can be used inside other schemas.
 * Just be careful not to create an infinite loop by using a custom Schema Type in itself or child.
 *
 * @type {{type: string, schema: {address1: String, address2: String, city: {type: String, required: boolean}, state: {type: String, required: boolean}, postalCode: String, country: {type: String, required: boolean}, longitude: {type: Number, required: boolean}, latitude: {type: Number, required: boolean}}}}
 */
const locationSchema={
	name: 'Location',
	structure:{
		address1: joi.string().required(),
		address2: joi.string(),
		city: joi.string().required(),
		state: joi.string().required(),
		postalCode: joi.string(),
		country: joi.string().required(),
		longitude: joi.number().required(),
		latitude: joi.number().required,
	}
}

module.exports = registry.registerType(locationSchema);


