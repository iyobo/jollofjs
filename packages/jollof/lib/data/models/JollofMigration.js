/**
 * Created by iyobo on 2016-09-18.
 */
const data = require('../../../index').data;


//Models use names
const schema = {
	name: 'JollofMigration',
	structure: {
		order: { type: Number, required: true },
		path: { type: String, required: true },
		reason: String,
	}
}

module.exports = data.registerModel(schema);