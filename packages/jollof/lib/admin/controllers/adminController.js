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
			log.err(err.stack);
			this.throw(err);
		}
	},

	//List all
	list: function*( modelName ) {
		try {

			const page = Number(this.query['_page'])
			const start = Number(this.query['_start'])
			const end = Number(this.query['_end'])

			//pagination params
			const options = {
				paging: {
					page: page,
					limit: (end - start) + 1
				},
				sorting: {
					sortBy: this.query['_sort'],
					order: this.query['_order']
				},
				// raw: true
			};

			if(!options.paging.page){
				options.paging.page = (end+1)/ options.paging.limit;
			}

			const res = yield models[ modelName ].find({}, options);
			// console.log(res);

			this.body = res.items.map((it)=>{
				return it.display();
			});

			//Set headers
			this.set('x-total-count', options.paging.limit+'/'+res.count);
		} catch (err) {
			log.err(err.stack);
			this.body = err;
		}

	},

	//Get singular
	get: function*( modelName, id ) {
		try {
			this.body = (yield models[ modelName ].findById(id)).display()
		} catch (err) {
			log.err(err.stack);
			this.throw(err);
		}
	},

	//Create
	create: function*( modelName ) {
		//get schema
		try {
			this.body = yield models[ modelName ].create(this.request.body)
		} catch (err) {
			log.err(err.stack);
			this.throw(err);
		}
	},

	//Update
	update: function*( modelName, id ) {
		try {
			this.body = yield models[ modelName ].update({id: id}, this.request.body)
		} catch (err) {
			log.err(err.stack);
			this.throw(err);
		}
	},

	//Delete or disable
	delete: function*( modelName, id ) {
		try {
			this.body = yield models[ modelName ].remove({id: id})
		} catch (err) {
			log.err(err.stack);
			this.throw(err);
		}
	},
}