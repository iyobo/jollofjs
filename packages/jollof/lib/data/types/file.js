const registry = require('../registry');
const joi = require('joi');
/**
 * This is an in-built Schema Type.
 * Schema Types are schemas themselves, and can be used inside other schemas.
 * Just be careful not to create an infinite loop by using a custom Schema Type in itself or child.
 */
const fileSchema = {
	name: 'File',
	structure: joi.alternatives().try(
		joi.object({
			name: joi.string().required(),
			size: joi.number(),
			type: joi.string(),

			path: joi.string(),
			url: joi.string(),
			key: joi.string(),

			engine: joi.string().default('local')
		}),
		joi.string().allow('')
	).meta({widget: 'file'}) //For deleted files

}

module.exports = registry.registerType(fileSchema);

//array version
// name: 'File',
// 	structure: joi.array().items(joi.object().keys({
// 	name: joi.string().required(),
// 	size: joi.number(),
// 	type: joi.string(),
//
// 	path: joi.string(),
// 	url: joi.string(),
// 	key: joi.string(),
// 	engine: joi.string().default('local')
// })).meta({widget: 'file'})