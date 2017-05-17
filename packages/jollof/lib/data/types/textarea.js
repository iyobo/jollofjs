const registry = require('../registry');

/**
 * This is an in-built Schema Type.
 * Schema Types are schemas themselves, and can be used inside other schemas.
 *
 * This type is a singular textarea field def.
 */
const textareaSchema = {
	name: 'Textarea',
    required: false,
	structure: {
        type: String,
		meta:{
			widget: 'textarea',
		}
    }
}


module.exports = registry.registerType(textareaSchema);