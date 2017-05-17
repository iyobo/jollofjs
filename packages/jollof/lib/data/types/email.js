const registry = require('../registry');

/**
 * This is an in-built Schema Type.
 * Schema Types are schemas themselves, and can be used inside other schemas.
 *
 * This type is a singular Email field def.
 */
const emailSchema = {
    name: 'Email',
    structure: {
        type: String,
        meta: {
            widget: 'email',
        },
        trim: true,
        match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    }
}


module.exports = registry.registerType(emailSchema);