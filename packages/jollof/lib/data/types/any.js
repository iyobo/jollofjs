const registry = require('../registry');

/**
 * This is an in-built Schema Type.
 * Schema Types are schemas themselves, and can be used inside other schemas.
 * Just be careful not to create an infinite loop by using a custom Schema Type in itself or child.
 *
 *
 * This type is used to store relationships to other entities/models by id.
 * Before storage, the type of the id will be cast to the adapter.idType of dataSourceName ('default' by default)
 */
const schema = {
    name: 'Any',
    structure: {
        meta: {},
        custom: function (data, schema) {
            return data;
        }
    }

};

module.exports = registry.registerType(schema);


