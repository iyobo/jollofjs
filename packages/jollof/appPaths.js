/**
 * Created by iyobo on 2016-10-17.
 */
const path = require('path');
const root = process.cwd();

module.exports={
	appRoot: root,
	models: path.join(root,'app','models'),
	controllers: path.join(root,'app','controllers'),
	views: path.join(root,'app','views'),
	schemaTypes: path.join(root,'app','data','types'),
	services: path.join(root,'app','services'),
	viewFilters: path.join(root,'app','views','filters'),
	config: path.join(root,'config'),
	baseConfig: path.join(root,'config','base'),
	commands: path.join(root,'app','commands'),


}