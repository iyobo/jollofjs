'use strict'

const bridge = require('../../../bridge');
const modelObj = require('../../loadModels');

//FIXME: This should reference services...if it's still being used

module.exports = {
	index: function*() {

		// let ng
		// //Generate config string for ngadmin
		// for (let k in EL.models){
		//
		// }

		yield this.render('admin/index',{models: modelObj.models});
	},

	//List all
	list: function*(modelName) {
		// const model = EL.models[modelName]

		// this.body = {
		// 	result: yield model.paginate({}, {})
		// };
		this.body= (yield modelObj.models[modelName].paginate({}, {})).docs;

	},

	//Get singular
	get: function*(modelName, id) {

		this.body = {
			result: yield modelObj.models.modelName.findById(id)
		};
	},

	//Create
	post: function*(modelName) {
		//get schema
		this.body = {
			result: yield modelObj.models.modelName.create(this.request.body)
		};
	},

	//Update
	patch: function*(modelName, id) {
		this.body = {
			result: yield modelObj.models.modelName.findByIDAndUpdate(id, this.request.body)
		};
	},

	//Delete or disable
	delete: function*(modelName, id) {
		this.body = {
			result: yield modelObj.models.modelName.remove(id)
		}
	},
}