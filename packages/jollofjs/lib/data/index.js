/**
 * Created by iyobo on 2016-10-27.
 */
const registry = require('./registry');

/**
 * These module loaders should be dumb.
 * All they should do is run files, who should registers themselves.
 *
 * @type {{registerModel, registerType, types: *, models: *}}
 */


module.exports ={
	registerModel: registry.registerModel(),
	registerType: registry.registerType(),
	types: registry.types,
	models: registry.models,
	init: registry.init
}