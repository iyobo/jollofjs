const registry = require('../registry');
/**
 * This is an in-built Schema Type.
 * Schema Types are schemas themselves, and can be used inside other schemas.
 * Just be careful not to create an infinite loop by using a custom Schema Type in itself or child.
 *
 * @type {{type: string, schema: {address1: String, address2: String, city: {type: String, required: boolean}, state: {type: String, required: boolean}, postalCode: String, country: {type: String, required: boolean}, longitude: {type: Number, required: boolean}, latitude: {type: Number, required: boolean}}}}
 */
const locationSchema = {
	name: 'Location',
	structure: {
		type: Object,
		required: false,
		schema: {
			address: { type: String, required: true },
			address2: String,
			city: { type: String, required: true },
			state: { type: String, required: true },
			postalCode: String,
			country: { type: String, required: true },
			longitude: { type: Number, required: true },
			latitude: { type: Number, required: true },
			full: String
		},
		meta: {
			widget: 'map',
		}
	}

}

module.exports = registry.registerType(locationSchema);


