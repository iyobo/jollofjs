/**
 * Created by iyobo on 2016-10-27.
 */
const _ = require('lodash');
const joi = require('joi');
const Promise = require('bluebird')
const joiValidatePromise = Promise.promisify(joi.validate);
const stringUtil = require('../util/stringUtil');
const config = require('../configurator');
const log = require('../log');

/**
 * Here we use the adapter to setup the collection this Model represents
 * @param adapter
 * @param schema
 */


/**
 * Takes a schema. Returns a Model
 * @param schema
 * @returns {*}
 */
module.exports.modelize = function ( schema ) {
	const adapterName = this._adapterName = schema.adapter || config.settings.db.defaultAdapter || 'arangodb'; //:) arango is default just because
	const adapter = require('jollof-data-' + this._adapterName)(config.settings.db[ adapterName ]);

	//create tables, indexes, etc

	adapter.configureCollection(schema);

	/**
	 * This is a dynamically crafted class with some accessor/proxy magic. E.g userInstance.firstName will return userInstance.data.firstName
	 * @type {{updateAll: ((id)), update: ((id)), list: ((id)), get: ((id)), delete: ((id)), new(data)=>{validate: (()), save: (()), type}}}
	 */
	const Model = class {
		constructor( data ) {
			this._loadData(data);
			this._loadRules(schema.structure);
			this._adapterName = adapterName;
			// this._adapter = adapter;

			this._collectionName = schema.name;
			this._collectioonDisplayName = stringUtil.labelize(schema.name);
			this._originalSchema = schema;

			//This is where ids should be stored
			this._ids = null;
		}

		_loadData( data ) {
			this._data = data;
		}

		_loadRules( structure ) {

			const tempStructure = _.assign({}, structure);

			//Add DB adapter meta fields
			_.each(adapter.getIdFields(), ( fieldName )=> {
				tempStructure[ fieldName ] = joi.any().optional();
			});

			//Add date fields
			tempStructure[ 'dateCreated' ] = joi.date().optional();
			tempStructure[ 'lastUpdated' ] = joi.date().optional();

			//Add schema rules
			this._rules = joi.object().keys(tempStructure);
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

		static * find( id ) {
			return 'List ' + schema.name;
		}

		static * update( id ) {
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

				this._setTimestamps();
				yield adapter.save(this);
				// log.debug('Saved ' + this._collectionName)
				null;

			} catch (err) {
				throw err;
			}
		}

	};

	//Proxy class for wrapping models
	const ModelProxy = class {
		constructor( data ) {
			let dataKeys = Object.keys(schema.structure);
			dataKeys.push('dateCreated', 'lastUpdated');

			const model = new Model(data);

			var modelAccessor = {
				set ( target, key, value ) {
					if (dataKeys.indexOf(key) > -1)
						target._data[ key ] = value;
					else if (adapter.getIdFields().indexOf(key) > -1)
						target._ids[ key ] = value;
					else
						target[ key ] = value;
					return true
				},
				get ( target, key ) {
					//if key exists in data's keys, get from there. otherwise get from the model
					if (dataKeys.indexOf(key) > -1)
						return target._data[ key ];
					else if (adapter.getIdFields().indexOf(key) > -1)
						return target._ids[ key ];
					else
						return target[ key ];
				}
			}

			return new Proxy(model, modelAccessor);
		}
	}


	// This way we can new jollof.models.user({firstName:'Joe'})
	return ModelProxy;
}