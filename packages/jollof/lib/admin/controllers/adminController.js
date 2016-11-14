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
		try {
			//pagination params
			const options = {
				// pagination: {
				// 	page: this.query('_page'),
				// 	start: this.query('_start'),
				// 	end: this.query('_end')
				// },
				// sorting: {
				// 	sort: this.query('_sort'),
				// 	order: this.query('_order')
				// }
			};

			let res = yield models[ modelName ].find({}, options);
			res = res.map(( it )=> {
				return it.display();
			});
			this.body = res;

			//Set headers
			this.set('x-total-count', res.length);
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
	update: function*( modelName, id ) {
		try {
			this.body = yield models[ modelName ].update({id: id}, this.request.body)
		} catch (err) {
			this.body = err;
		}
	},

	//Delete or disable
	delete: function*( modelName, id ) {
		try {
			this.body = yield models[ modelName ].remove({id: id})
		} catch (err) {
			this.body = err;
		}
	},
}