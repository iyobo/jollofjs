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

			if (this.query[ '_start' ]) {
				var page = Number(this.query[ '_page' ])
				var start = Number(this.query[ '_start' ])
				var end = Number(this.query[ '_end' ])

				var sort = this.query[ '_sort' ];
				var order = this.query[ '_order' ];
			} else {
				let rangeq = JSON.parse(this.query[ 'range' ]);
				var start = Number(rangeq[ 0 ]);
				var end = Number(rangeq[ 1 ]);

				let sortq = JSON.parse(this.query[ 'sort' ]);
				var sort = sortq[ 0 ];
				var order = sortq[ 1 ];
			}
			//pagination params
			const options = {
				paging: {
					page: page,
					limit: (end - start) + 1
				},
				sorting: {
					sort: sort,
					order: order
				},
				// raw: true
			};

			if (!options.paging.page) {
				options.paging.page = (end + 1) / options.paging.limit;
			}

			const res = yield models[ modelName ].find({}, options);
			// console.log(res);

			this.body = res.items.map(( it )=> {
				return it.display();
			});

			//Set headers
			this.set('x-total-count', options.paging.limit + '/' + res.count);
			this.set('content-range', options.paging.limit + '/' + res.count);
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
			const res = yield models[ modelName ].update({id: id}, this.request.body)
			this.body = res;
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