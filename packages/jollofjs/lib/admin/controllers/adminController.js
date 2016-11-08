'use strict'

const data = require('../../data');
const _ = require('lodash');

//FIXME: This should reference services...if it's still being used

module.exports = {
	index: function*() {
		yield this.render('jollofadmin/index', {models: data.models});
	},

	models: function*( ) {
		//generate a list of model schemas and send it down
		let models = [];
		_.each(data.models, (model)=>{
			models.push(model.schema)
		});

		this.body = models;
	},

	//List all
	list: function*( modelName ) {
		// const model = EL.models[modelName]

		// this.body = {
		// 	result: yield model.paginate({}, {})
		// };
		this.body = (yield data.models[ modelName ].paginate({}, {})).docs;

	},

	//Get singular
	get: function*( modelName, id ) {

		this.body = {
			result: yield data.models[ modelName ].findById(id)
		};
	},

	//Create
	post: function*( modelName ) {
		//get schema
		this.body = {
			result: yield data.models[ modelName ].create(this.request.body)
		};
	},

	//Update
	patch: function*( modelName, id ) {
		this.body = {
			result: yield data.models[ modelName ].update(id, this.request.body)
		};
	},

	//Delete or disable
	delete: function*( modelName, id ) {
		this.body = {
			result: yield data.models[ modelName ].remove(id)
		}
	},
}