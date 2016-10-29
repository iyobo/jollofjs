/**
 * Created by iyobo on 2016-10-27.
 */
const _ = require('lodash');
const joi = require('joi');

/**
 * Takes a schema. Wraps it in a joi object, and Returns a model
 * @param schema
 * @returns {*}
 */
module.exports.modelize = function ( schema ) {

	/**
	 * This is a dynamically crafted class with tons of accessor magic. E.g userInstance.firstName will return userInstance.data.firstName
	 * @type {{updateAll: ((id)), update: ((id)), list: ((id)), get: ((id)), delete: ((id)), new(data)=>{validate: (()), save: (()), type}}}
	 */
	const Model = class {
		constructor( data ) {
			this.data = data;
			this.validator = joi.object().keys(schema.structure);
		}

		get className() {
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