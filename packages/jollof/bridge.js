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
const appPaths = require('./appPaths');

module.exports={

	config: require(),
	viewFilters: require(),
	services: require()
}