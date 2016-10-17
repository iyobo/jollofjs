/**
 * Created by iyobo on 2016-10-17.
 */
/**
 * The nexus point that Bridges JollofJS with the app.
 * E.g. If you want to read an app's config value, you must use the bridge!
 *
 * @type {{config: Env}}
 */
const path = require('path');

module.exports={
	appRoot: process.cwd() + '/',

	config: require('../../config'),
	viewFilters: require('../../app/views/filters'),

	modelsPath: path.join('..','..','app','mongomodels'),
	services: require("../../app/services")
}