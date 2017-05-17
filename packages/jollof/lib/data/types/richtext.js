const registry = require('../registry');

/**
 * This is an in-built Schema Type.
 * Schema Types are schemas themselves, and can be used inside other schemas.
 *
 * This type is a singular richtext field def.
 */
const richtextSchema = {
	name: 'RichText',
    required: false,
	structure: {
        type: String,
		meta:{
			widget: 'richtext',
		}
    }
}


module.exports = registry.registerType(richtextSchema);