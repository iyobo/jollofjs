/**
 * Created by iyobo on 2016-10-27.
 */
const valix = require('validate');
const _ = require('lodash');

/**
 * Takes a schema. Returns a model
 * @param schema
 * @returns {*}
 */
module.exports.modelize = function ( schema ) {

	const modelRules={};

	//For each field defined in structure
	for(let fieldName in schema.structure){
		const rules={}
		const attrs = schema.structure[fieldName];

		//craft validation rules from attrs
		let gg = typeof attrs;
		//

		const coreType = typeof attrs;
		let fieldType = "";
		if(coreType === 'function'){
			//This means it's a class e.g. Boolean, String, etc.
			fieldType = attrs.name;
		}else{
			//This means it is a full schema field def, and so must have type field
			fieldType = attrs.type.name;
		}

		console.log(fieldName, fieldType);

		//Add crafted field constraints to model validation rules
		modelRules[fieldName] = rules;
	}

	/**
	 * This is a dynamically crafted class with tons of accessor magic. E.g userInstance.firstName will return userInstance.data.firstName
	 * @type {{updateAll: ((id)), update: ((id)), list: ((id)), get: ((id)), delete: ((id)), new(data)=>{validate: (()), save: (()), type}}}
	 */
	const Model = class {
		constructor( data ) {
			this.data = data;

			this.rules = modelRules;
		}

		get type() {
			return schema.name;
		}

		static * get( id ) {
			return 'Got ' + schema.name;
		}

		static * list( id ) {
			return 'List ' + schema.name;
		}

		static * update( id ) {
			return "Hohoho";
		}

		static * updateAll( id ) {
			return "Hohoho";
		}

		static * delete( id ) {
			return "Hohoho";
		}

		validate() {
			// validate it according to structure


			return true;
		}

		* save() {
			if (this.validate()) {
				return this;
			}
			else {
				return null;
			}
		}


	};

	// This way we can new jollof.models.user({firstName:'Joe'})
	return Model;
}