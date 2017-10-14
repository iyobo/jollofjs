/**
 * Created by iyobo on 2017-04-30.
 */
const _ = require('lodash');

/**
 * populates schema with meta.type field.
 * The meta object contains all information needed to render this schema in Jollof-compatible frontends.
 * contains field type (as string), required, etc.
 */
exports.populateMetaTypes = (schema, isChild) => {

    //This should be present after formalization
    schema.meta = schema.meta || {};
    if (schema.type) {
        schema.meta.type = schema.type.name;
    }
    else if (schema.custom) {
        //An ANY field
        schema.meta.type = 'any';
    }
    else {
        throw new Error('Jollof Model Initialization Error: Cannot populateMeta for unFormalized schema. This is likely an internal Jollof bug. Please upgrade to the latest version of JollofJS')
    }

    //recurse for children
    if (schema.schema) {
        let structure = schema.schema;

        //Prepare fieldOrder array
        let fieldOrder = isChild ? [] : ['id'];

        //if it's an array...skip to child schema
        _.each(structure, (childSchema, k) => {

            if (!childSchema.type) {
                exports.populateMetaTypes(childSchema, true);
            }
            else if (childSchema.type.name === 'Array') {
                exports.populateMetaTypes(childSchema.schema, true);
            }
            else {
                exports.populateMetaTypes(childSchema, true);
            }

            if (k !== 'id')
                fieldOrder.push(k);
        });

        schema.fieldOrder = fieldOrder;

    }

}