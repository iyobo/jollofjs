const registry = require('../registry');

/**
 * This is an in-built Schema Type.
 * Schema Types are schemas themselves, and can be used inside other schemas.
 * Just be careful not to create an infinite loop by using a custom Schema Type in itself or child.
 */
const fileSchema = {
	name: 'File',
	structure: {
        type: Object,
        required: false,
        schema: {
            name: { type: String, required: true },
            size: Number,
            type: { type: String, required: true },

            path: String,
            url: String,
            key: String,

            engine: { type: String, required: true , default:'http'},
        },
		meta:{
			widget: 'file',
		}
    }
}


module.exports = registry.registerType(fileSchema);