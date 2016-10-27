/**
 * Created by iyobo on 2016-10-17.
 */
const path = require('path');
const root = process.cwd();

module.exports={
	appRoot: root,
	models: path.join(root,'app','models'),
	schemaTypes: path.join(root,'app','types'),
	services: path.join(root,'app','services'),
	viewFilters: path.join(root,'app','views','filters'),
	config: path.join(root,'config'),
	commands: path.join(root,'app','commands')
}