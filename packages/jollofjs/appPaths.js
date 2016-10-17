/**
 * Created by iyobo on 2016-10-17.
 */
const path = require('path');

module.exports={
	appRoot: process.cwd() + '/',
	models: path.join('..','..','app','mongomodels'),
	services: "../../app/services",
	viewFilters: '../../app/views/filters',
	config: '../../config',
	commands: '../../commands'
}