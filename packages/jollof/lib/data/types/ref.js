const registry = require('../registry');
const config = require('../../configurator');
const dataSourceSettings = config.settings.data.dataSources;
/**
 * This is an in-built Schema Type.
 * Schema Types are schemas themselves, and can be used inside other schemas.
 * Just be careful not to create an infinite loop by using a custom Schema Type in itself or child.
 *
 *
 * This type is used to store relationships to other entities/models by id.
 * Before storage, the type of the id will be cast to the adapter.IdType of dataSourceName ('default' by default)
 */
const refSchema = {
    name: 'Ref',
    structure: {
        meta: {
            widget: 'ref',
            ref: '',
            dataSourceName: 'default'
        },
        custom: function (data, schema) {
            let validatedData = data;
            const IdType = dataSourceSettings[schema.meta.dataSourceName].adapter.IdType;

            if (validatedData && IdType && typeof validatedData !== IdType.name) {
                validatedData = new IdType(validatedData);
            }

            return validatedData;
        }
    }

};

module.exports = registry.registerType(refSchema);


