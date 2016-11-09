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
	const collectionName = schema.name;
	//create tables, indexes, etc

	// adapter.configureCollection(schema);

	/**
	 * This is a dynamically crafted class with some accessor/proxy magic. E.g userInstance.firstName will return userInstance.data.firstName
	 * @type {{updateAll: ((id)), update: ((id)), list: ((id)), get: ((id)), delete: ((id)), new(data)=>{validate: (()), save: (()), type}}}
	 */
	const Model = class {
		constructor( data ) {
			this._loadData(data);
			this._loadRules(schema.structure);
			this._adapterName = adapterName;
			this._adapter = adapter;

			this._collectionName = schema.name;
			this._collectioonDisplayName = stringUtil.labelize(schema.name);
			this._originalSchema = schema;

			this._idField = "_id"; //by default


			//Proxy magic
			let dataKeys = Object.keys(schema.structure);
			dataKeys.push('dateCreated', 'lastUpdated');

			// const model = new Model(data);
			var modelAccessor = {
				set ( target, key, value ) {
					if (target._isDeleted)
						throw new Error('Jollof Data: Cannot set data for a deleted item');

					if (dataKeys.indexOf(key) > -1)
						target._data[ key ] = value;
					else if (adapter.idFields.indexOf(key) > -1)
						target._ids[ key ] = value;
					else
						target[ key ] = value;
					return true
				},
				get ( target, key ) {
					if (target._isDeleted)
						throw new Error('Jollof Data: Cannot get data from a deleted item');

					//if key exists in data's keys, get from there. otherwise get from the model
					if (dataKeys.indexOf(key) > -1)
						return target._data[ key ];
					else if (adapter.idFields.indexOf(key) > -1)
						return target._ids[ key ];
					else
						return target[ key ];
				}
			}

			return new Proxy(this, modelAccessor);
		}

		/**
		 * Must be called once, during boot, to configure the database with
		 * collections/indices for this Model.
		 */
		static * setup() {
			const g = yield adapter.configureCollection(schema);
		}

		static get collectionName() {
			return schema.name;
		}

		static get adapterName() {
			return adapterName;
		}

		static get adapter() {
			return adapter;
		}

		static get schema() {
			return schema;
		}

		static * findById( id, params ) {
			const val = yield adapter.findById(collectionName, id, params || {});
			return Model.instantiate(val);
		}

		/**
		 * Digests an array or object and returns either an array or singular model instance of the model.
		 * @param data
		 * @returns {*}
		 */
		static instantiate( data ) {

			if (!data)
				return null;

			if (Array.isArray(data)) {
				//This is an array of items
				return data.map(( item )=> {
					return new Model(item);
				});
			}
			else {
				//a singular item. wrap it
				return new Model(data);
			}
		}

		/**
		 * Prepares the criteria for adapter use.
		 * E.g if the word 'id' exists in the criteria, convert that to the adapter's idField.
		 *
		 * @param criteria
		 * @returns {*}
		 * @private
		 */
		static _scrubCriteria( criteria ) {

			criteria = criteria||{};

			if (criteria[ 'id' ] && 'id' !== adapter.idField) {
				criteria[ adapter.idField ] = criteria[ 'id' ];
				delete criteria[ 'id' ];
			}

			return criteria
		}

		/**
		 *
		 * @param criteria
		 * @param params
		 * @returns {*}
		 */
		static * find( criteria, params ) {

			const res = yield adapter.find(collectionName, Model._scrubCriteria(criteria), params || {});
			return Model.instantiate(res);
		}

		/**
		 *
		 * @param criteria
		 * @param params
		 * @returns {*}
		 */
		static * findOne( criteria, params ) {
			const res = yield adapter.findOne(collectionName, Model._scrubCriteria(criteria), params || {});
			return Model.instantiate(res);
		}

		/**
		 *
		 * @param criteria
		 * @param params
		 * @returns {*}
		 */
		static * update( criteria, params ) {
			return yield adapter.update(collectionName, Model._scrubCriteria(criteria), params || {});
		}

		/**
		 *
		 * @param criteria
		 * @param params
		 * @returns {*}
		 */
		static * create( data, params ) {

			return yield new Model(data).save()

		}

		/**
		 * DISALLOWED
		 * If you are not sure your update query is only updating one,
		 * then you need to just grab that as a model, compare/contrast and update the one you want.
		 * Prevents mistaken updates.
		 *
		 * @param criteria
		 * @param params
		 * @returns {*}
		 */
		// static * updateOne( criteria, params ) {
		// 	params = params || {};
		// 	params.limit = 1;
		// 	return yield adapter.update(collectionName, Model._scrubCriteria(criteria), params || {});
		// }

		/**
		 * @param criteria
		 * @param params
		 * @returns {*}
		 */
		static * remove( criteria, params ) {
			return yield adapter.remove(collectionName, Model._scrubCriteria(criteria), params || {});
		}

		/**
		 *
		 * @param criteria
		 * @param params
		 * @returns {*}
		 */
		static * removeOne( criteria, params ) {
			params = params || {};
			params.limit = 1;
			return yield adapter.remove(collectionName, Model._scrubCriteria(criteria), params);
		}

		_loadData( data ) {

			this._ids = {};
			this._data = {};

			//seperate data from ids
			for (let key in data) {
				if (adapter.idFields.indexOf(key) > -1) {
					this._ids[ key ] = data[ key ];
				}
				else {
					this._data[ key ] = data[ key ];
				}
			}
		}

		_loadRules( structure ) {

			const tempStructure = _.assign({}, structure);

			//Add DB adapter meta fields
			_.each(adapter.idFields, ( fieldName )=> {
				tempStructure[ fieldName ] = joi.any().optional();
			});

			//Add date fields
			tempStructure[ 'dateCreated' ] = joi.date().optional();
			tempStructure[ 'lastUpdated' ] = joi.date().optional();

			//Add schema rules
			this._rules = joi.object().keys(tempStructure);
		}

		isPersisted() {
			return (this._ids && this._ids[ adapter.idField ] );
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

		* validate() {
			this._data = yield joiValidatePromise(this._data, this._rules, {
				stripUnknown: true, //quietly strip unknown keys without throwing an error
			});
			// console.log(this._data)
		}

		* _preSave() {
			if (schema.hooks && schema.hooks.pre && schema.hooks.pre.save) {
				yield schema.hooks.pre.save(this);
			}
		}

		* _preCreate() {
			if (schema.hooks && schema.hooks.pre && schema.hooks.pre.create) {
				yield schema.hooks.pre.create(this);
			}
		}

		* _postSave() {
			if (schema.hooks && schema.hooks.post && schema.hooks.post.save) {
				yield schema.hooks.post.save(this);
			}
		}

		* _postCreate() {
			if (schema.hooks && schema.hooks.post && schema.hooks.post.create) {
				yield schema.hooks.post.create(this);
			}
		}

		* _preRemove() {
			if (schema.hooks && schema.hooks.pre && schema.hooks.pre.remove) {
				yield schema.hooks.pre.remove(this);
			}
		}

		* _postRemove() {
			if (schema.hooks && schema.hooks.post && schema.hooks.post.remove) {
				yield schema.hooks.post.remove(this);
			}
		}


		/**
		 * Persists the model object in the DB
		 * @returns {boolean}
		 */
		* save() {

			const creating = this.isPersisted()?false: true;

			//pre
			if(creating)
				yield this._preCreate(this);

			yield this._preSave(this);

			//validate
			yield this.validate();

			this._setTimestamps();
			const res = yield adapter.saveModel(this);

			if(creating)
				yield this._postCreate(this);

			yield this._postSave(this);

			log.debug('Saved ' + this._ids[ adapter.idField ]);
			return res;
		}

		/**
		 * Marks this item as deleted.
		 * Severs ties with stuff and prepare this object as much as possible for GC.
		 * @private
		 */
		_markDeleted() {

			this._data = null;
			this._ids = null;
			this._isDeleted = true;
		}

		/**
		 * Delete this item from the database
		 * @returns {boolean}
		 */
		* remove() {

			yield this._preRemove();
			yield adapter.removeModel(this);
			yield this._postRemove();

			this._markDeleted();
			return true;
		}

		/**
		 * The json representation of this model's combined data.
		 */
		display() {
			return _.assign(this._ids, this._data);
		}

		toString(){
			return JSON.stringify(this.display());
		}

	};

	// This way we can new jollof.models.user({firstName:'Joe'})
	return Model;
}