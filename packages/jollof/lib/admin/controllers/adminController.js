'use strict'

module.exports = {
	index: function*() {

		// let ng
		// //Generate config string for ngadmin
		// for (let k in EL.models){
		//
		// }

		yield this.render('admin/index',{models: EL.models});
	},

	//List all
	list: function*(modelName) {
		const model = EL.models[modelName]

		// this.body = {
		// 	result: yield model.paginate({}, {})
		// };
		this.body= (yield model.paginate({}, {})).docs;

	},

	//Get singular
	get: function*(modelName, id) {

		this.body = {
			result: yield EL.models.modelName.findById(id)
		};
	},

	//Create
	post: function*(modelName) {
		//get schema
		this.body = {
			result: yield EL.models.modelName.create(this.request.body)
		};
	},

	//Update
	patch: function*(modelName, id) {
		this.body = {
			result: yield EL.models.modelName.findByIDAndUpdate(id, this.request.body)
		};
	},

	//Delete or disable
	delete: function*(modelName, id) {
		this.body = {
			result: yield EL.models.modelName.remove(id)
		}
	},
}