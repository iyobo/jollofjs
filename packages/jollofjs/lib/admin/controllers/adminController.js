'use strict'

const data = require('../../data');
const models = data.models;
const log = require('../../log');
const boom = require('boom');
const _ = require('lodash');

//FIXME: This should reference services...if it's still being used

module.exports = {
	index: function*() {
		// try {
		yield this.render('jollofadmin/index', {models: data.models});

		// }catch(err){
		// 	log.error(err);
		// }
	},

	models: function*() {
		//generate a list of model schemas and send it down
		try {
			let schemas = [];
			_.each(models, ( model )=> {
				schemas.push(model.schema);
			});

			this.body = schemas;
		} catch (err) {
			this.body = err;
		}
	},

	//List all
	list: function*( modelName ) {
		// const model = EL.models[modelName]

		// this.body = {
		// 	result: yield model.paginate({}, {})
		// };
		try {
			let res = yield models[ modelName ].find();
			res = res.map(( it )=> {
				return it.display();
			})
			this.body = res;
		} catch (err) {
			this.body = err;
		}

	},

	//Get singular
	get: function*( modelName, id ) {
		try {
			this.body = yield models[ modelName ].findById(id)
		} catch (err) {
			this.body = err;
		}
	},

	//Create
	create: function*( modelName ) {
		//get schema
		try {
			this.body = yield models[ modelName ].create(this.request.body)
		} catch (err) {
			this.body = err;
		}
	},

	//Update
	patch: function*( modelName, id ) {
		try {
			this.body = yield models[ modelName ].update(id, this.request.body)
		} catch (err) {
			this.body = err;
		}
	},

	//Delete or disable
	delete: function*( modelName, id ) {
		try {
			this.body = yield models[ modelName ].remove(id)
		} catch (err) {
			this.body = err;
		}
	},
}