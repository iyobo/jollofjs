/**
 * Created by iyobo on 2017-01-17.
 */
const axios = require('axios');
import ajaxSpice from './ajaxSpice';
import notificationSpice from './notificationSpice';
const _ = require('lodash');

const defaultQuery = {
	paging: {
		page: 1,
		limit: 10
	},
	sort: { dateCreated: -1 },
	filters: [] //for defining criterias e.g age==$gt==23
};

const defaultActiveState = {
	single: {},
	tableCount: 0,
	pageCount: 0,
	table: [],
	model: {}
};

class ModelSpice {
	constructor() {

		this.models = [];
		this.query = _.cloneDeep(defaultQuery);
		this.active = _.cloneDeep(defaultActiveState);
	}

	fetchModels() {

		return ajaxSpice.get('/api/v1/resource').then((response) => {

			this.models = response.data;
		});

	}

	/**
	 * Finds the model with this name in the list of models, and make it seleted
	 * @param name
	 */
	activateModelByName(name) {

		this.query = _.cloneDeep(defaultQuery);
		//this.active.single = {};

		if (this.models.length == 0) {
			notificationSpice.error('No models loaded yet');
			console.error('No models loaded yet');
			return;
		}

		for (let k in this.models) {
			let m = this.models[k];
			if (name == m.name) {
				this.selectModel(m);

				return;
			}
		}

		notificationSpice.error('The model does not exist: ' + name);
	}

	selectModel(model) {
		this.active.model = model;
		this.active.table = [];

		console.log('Active Model: ' + this.active.model.name);

	}

	fetchList() {
		return ajaxSpice.get('/api/v1/resource/' + this.active.model.name, { params: this.query })
			.then((response) => {
				this.active.table = response.data;

				this.active.tableCount = Number(response.headers['jollof-total-count']);
				this.active.pageCount = Math.ceil(this.active.tableCount / this.query.paging.limit);
			});

	}

	fetchSingle(id) {
		this.active.single = {};
		return ajaxSpice.get('/api/v1/resource/' + this.active.model.name + '/' + id, { params: this.query })
			.then((response) => {
				this.active.single = response.data;
				return response;
			});

	}


	addEmptyFilter() {
		this.query.filters.push([this.active.model.fieldOrder[0], '$eq', ''])
	}

	removeFilter(index) {
		this.query.filters.splice(index, 1);
	}

	deleteItem(item) {
		return ajaxSpice.delete('/api/v1/resource/' + this.active.model.name + '/' + item.id)

	}

	incrementPage() {
		if (this.query.paging.page < this.active.pageCount)
			this.query.paging.page++;
	}

	decrementPage() {
		if (this.query.paging.page > 1)
			this.query.paging.page--
	}

	sort(fieldName) {
		if (!this.query.sort[fieldName]) {
			this.query.sort = {};
			this.query.sort[fieldName] = 1;
		}

		this.query.sort[fieldName] = this.query.sort[fieldName] * -1;
	}


	save(values) {
		console.log('modelSpice: Saving', this.active.model.name, values);
		let promise;

		if (values.id) {
			promise = ajaxSpice.update('/api/v1/resource/' + this.active.model.name + '/' + values.id, values);
		} else {
			delete values.id;
			promise = ajaxSpice.create('/api/v1/resource/' + this.active.model.name, values);
		}

		return promise;
	}

}

/**
 * Exports a singleton
 */
export default new ModelSpice();
