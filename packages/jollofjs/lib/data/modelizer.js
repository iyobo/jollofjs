/**
 * Created by iyobo on 2016-10-27.
 */
const _ = require('lodash');
const joi = require('joi');
const Promise = require('bluebird')
const joiValidatePromise = Promise.promisify(joi.validate);
const stringUtil = require('../util/stringUtil');
const config = require('../configurator');
/**
 * Takes a schema. Wraps it in a joi object, and Returns a model
 * @param schema
 * @returns {*}
 */
module.exports.modelize = function ( schema ) {

	/**
	 * This is a dynamically crafted class with some accessor/proxy magic. E.g userInstance.firstName will return userInstance.data.firstName
	 * @type {{updateAll: ((id)), update: ((id)), list: ((id)), get: ((id)), delete: ((id)), new(data)=>{validate: (()), save: (()), type}}}
	 */
	const Model = class {
		constructor( data ) {
			this._loadData(data);
			this._loadRules(schema.structure);
			this._adapter = schema.adapter || config.settings.db.defaultAdapter || 'arangodb'; //:) arango is default just because

			this._className = stringUtil.labelize(schema.name);
			this._originalSchema = schema;
		}

		_loadData( data ) {
			this._data = data;
		}

		_loadRules( structure ) {
			this._rules = joi.object().keys(structure);
		}

		_setDateCreated() {
			if (!this._data.dateCreated)
				this._data.dateCreated = new Date();
		}

		_setDateUpdated() {
			this._data.lastUpdated = new Date();
		}

		_setTimestamps() {
			this._setDateCreated();
			this._setDateUpdated();
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

			yield joiValidatePromise(this._data, this._rules);
		}

		* save() {
			try {
				//validate
				yield this.validate();

				//TODO: yield save action with active adapter
				this._setTimestamps();

			} catch (err) {
				throw err;
			}
		}

	};

	//Proxy class for wrapping models
	const ModelProxy = class {
		constructor( data ) {
			let dataKeys = Object.keys(schema.structure);
			dataKeys.push('dateCreated','lastUpdated');

			var modelAccessor = {
				set ( target, key, value ) {
					target._data[key] = value;
					return true
				},
				get ( target, key ) {
					//if key exists in data's keys, get from there. otherwise get from the model
					if(dataKeys.indexOf(key)>-1)
						return target._data[key];
					else
						return target[key];
				}
			}

			return new Proxy(new Model(data), modelAccessor);
		}
	}


	// This way we can new jollof.models.user({firstName:'Joe'})
	return ModelProxy;
}