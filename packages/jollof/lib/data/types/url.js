const registry = require('../registry');

/**
 * This is an in-built Schema Type.
 * Schema Types are schemas themselves, and can be used inside other schemas.
 *
 * This type is a singular Email field def.
 */
const typeDef = {
	name: 'Url',
    required: false,
	structure: {
        type: String,
		trim: true,
		match: /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
    }
}

module.exports = registry.registerType(typeDef);