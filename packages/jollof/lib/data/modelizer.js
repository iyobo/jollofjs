/**
 * Created by iyobo on 2016-10-27.
 */
const _ = require('lodash');
const joi = require('joi');
const Promise = require('bluebird')
const joiValidatePromise = Promise.promisify(joi.validate);
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
			this.rules = joi.object().keys(schema.structure);
			console.log(schema.name, 'loaded')
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

		* validate() {

			yield joiValidatePromise(this.data, this.rules);
		}

		* save() {
			try {
				//validate
				yield this.validate();

				//TODO: upsert with active adapter

			} catch (err) {
				throw err;
			}
		}

	};

	// This way we can new jollof.models.user({firstName:'Joe'})
	return Model;
}