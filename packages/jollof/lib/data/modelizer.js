/**
 * Created by iyobo on 2016-10-27.
 */
const _ = require('lodash');
const Promise = require('bluebird');
const stringUtil = require('../util/stringUtil');
const config = require('../configurator').settings;
const log = require('../log');
const jfs = require('../filestorage');
const isValid = require('isvalid-jollof');
var jqlParser = require('./jollofql/index.js').jqlParser;
const Boom = require('boom');
var jql = require('./jollofql/index.js').jql;
//import {jql} from './jollofql/index';
var populateMetaTypes = require('../util/dataUtils.js').populateMetaTypes;

const isValidValidate = Promise.promisify(isValid);

const adapterMap = {};


/**
 * Takes a Jollof schema. Returns a Model
 * @param schema
 * @returns {*}
 */
exports.modelize = function (schema) {
    const collectionName = schema.name;

    const connectorName = schema.connector || 'default';
    const dataSource = config.data.dataSources[connectorName];

    /**
     * Only the native functions matching this connector's nativeName can be run for this model
     * @type {string}
     */
    const activeNativeType = dataSource.nativeType;

    let adapter;

    //if adapter has already been instantiated
    if (adapterMap[connectorName]) {
        adapter = adapterMap[connectorName];
    } else {
        adapter = new dataSource.adapter(dataSource.options);
        //TODO: Move this to something external that keeps "Active adapters mapped by connectorName".
        adapterMap[connectorName] = adapter;
    }


    /**
     * Generate validation rules for the model
     * @param structure
     * @returns {*}
     */
    const generateRules = (structure) => {
        //First clone the structure
        let tempStructure = _.merge({}, structure);

        /**
         * Some adapters use special meta-fields.
         * Add these fields to our rules so we do not wipe those metas out during validation!
         */
        _.each(adapter.metafields, (fieldName) => {
            tempStructure[fieldName] = String; //isvalid module doesn't have an 'any' type, so we use strings
        });

        /**
         * These are Jollof's own meta fields:
         * id: Every adapter must understand that this is Jollof's main id field
         * TimestampDates for time logging.
         */
        tempStructure['id'] = { type: String, meta: { type: 'String', disableEdit: true } };
        tempStructure['dateCreated'] = { type: Date, meta: { type: 'Date', disableEdit: true } };
        tempStructure['lastUpdated'] = { type: Date, meta: { type: 'Date', disableEdit: true } };


        /**
         * Finally, formalize the structure.
         * Converts all shortcut field defs to full {type:...} field defs
         */
        return isValid.formalize(tempStructure);
    };


    //Generate the rules for this Model. This is used purely by the validator
    const modelRules = generateRules(schema.structure);


    //const ruleClone = _.cloneDeep(modelRules);
    populateMetaTypes(modelRules);
    //The schema for this model is what various frontends use to render it.
    const modelSchema = modelRules; //JSON.parse(JSON.stringify(ruleClone));
    modelSchema.name = schema.name;
    modelSchema.unknownKeys = 'remove';


    /**
     * This is a dynamically crafted class with some accessor/proxy magic. E.g userInstance.firstName will return userInstance.data.firstName
     * @type {{updateAll: ((id)), update: ((id)), list: ((id)), get: ((id)), delete: ((id)), new(data)=>{validate: (()), save: (()), type}}}
     */
    const Model = class {

        constructor(data) {
            this._loadData(data);
            this._connectionName = connectorName;

            /**
             * Only the native functions matching active nativeTypes can be run for this model.
             * To be able to run nativefunctions of other nativeTypes, use a different connector that supports that type.
             * @type {string}
             */
            this._activeNativeType = activeNativeType;
            this._adapter = adapter;

            this._collectionName = schema.name;
            this._collectioonDisplayName = stringUtil.labelize(schema.name);
            this._originalSchema = schema;

            //Proxy magic
            let dataKeys = Object.keys(schema.structure);
            dataKeys.push('dateCreated', 'lastUpdated');

            // const model = new Model(data);
            var modelAccessor = {
                set (target, key, value) {
                    if (target._isDeleted)
                        throw new Error('Jollof Data: Cannot set data for a deleted item');

                    if (dataKeys.indexOf(key) > -1)
                        target._data[key] = value;
                    else
                        target[key] = value;

                    return true
                },
                get (target, key) {
                    if (target._isDeleted)
                        throw new Error('Jollof Data: Cannot get data from a deleted item');

                    //if key exists in data's keys, get from there. otherwise get from the model
                    if (dataKeys.indexOf(key) > -1)
                        return target._data[key];
                    else
                        return target[key];
                }
            };

            const thisProxy = new Proxy(this, modelAccessor);

            //attach custom/"underscore" functions
            this._ = {};
            if (schema.extend) {
                for (let funcName in schema.extend) {
                    this._[funcName] = schema.extend[funcName].bind(thisProxy);
                }
            }

            //console.log(this._data)

            return thisProxy;
        }

        /**
         * Must be called once, during boot
         */
        static async setup() {
            const g = await adapter.addSchema(schema);

            //Now let the model configure it's own self against its native adapter (e.g indexes etc)
            if (Model.native && Model.native.init) {
                await Model.native.init();
            }
        }

        static get collectionName() {
            return schema.name;
        }

        static get adapterName() {
            return connectorName;
        }

        static get adapter() {
            return adapter;
        }

        static get schema() {
            return modelSchema;
        }

        static get rules() {
            return modelRules;
        }

        /**
         * Digests an array or object and returns either an array or singular model instance of the model.
         * @param data - an object or array of objects
         * @returns {*}
         */
        static instantiate(data) {

            if (!data)
                return null;

            if (Array.isArray(data)) {
                //This is an array of items
                return data.map((item) => {
                    return new Model(item);
                });
            }
            else {
                //a singular item. wrap it
                return new Model(data);
            }
        }

        /**
         * For when you don't want to instantiate, but just want the fully formated version
         * FIXME: This can be optimized!!!!
         * @param data
         */
        static format(data) {
            if (!data)
                return null;

            if (Array.isArray(data)) {
                //This is an array of items
                return data.map((item) => {

                    return new Model(item).display();
                });
            }
            else {
                //a singular item. wrap it
                return new Model(data).display();
            }
        }


        static async findById(id, opts = {}) {

            const queryString = jql`id = ${id}`;

            let res = await Model.findOne(queryString, opts);

            return res;
        }

        /**
         * Finds one by json match
         * @param match json match
         * @param opts
         * @returns {Promise.<*>}
         */
        static async findOneBy(match, opts = {}) {

            const q = [];

            _.each(match, (v, k) => {
                q.push(k+jql` = ${v}`);
            });

            const qstr = q.join(' and ');

            let res = await Model.findOne(qstr, opts);

            return res;
        }


        /**
         * Finds one by json match or creates with those values if not exist
         *
         * @param match json match
         * @param opts
         * @returns - found or created object
         */
        static async findOrCreate(match, opts = {}) {

            let res = await Model.findOneBy(match);

            if (res) {
                res = new Model(match);
                await res.save();
            }

            return res;
        }


        /**
         * Searches for all matching items, and returns according to options.
         *
         * @param {string} queryString - A safe JQL string.
         * @param {object} options
         * @param {boolean} options.raw - if true, result will not be modelized. (But it will still respect the Jollof Id rule)
         * @param {object} options.paging -
         * @param {number} options.paging.page
         * @param {number} options.paging.limit
         * @param {object} options.sort - e.g {fieldA: 1, fieldB: -1}. 1 is asc, -1 is desc
         * @returns {*}
         */
        static async find(queryString, opts = {}) {

            let criteria = [];

            if (queryString && queryString.trim && queryString.trim() != '') {
                //For now, we can only send a string into the jql parser if it is NOT empty
                criteria = jqlParser.parse(queryString);
            }


            let res = await adapter.find(collectionName, criteria, opts);

            if (opts.raw) {
                return res;
            } else {
                res = Model.instantiate(res);
                return res;
            }

        }

        /**
         * Counts all items matching query criteria.
         *
         * @param {string} queryString - A safe JQL string.
         * @returns {*}
         */
        static async count(queryString) {
            let criteria = [];

            if (queryString && queryString.trim && queryString.trim() != '') {
                //For now, we can only send a string into the jql parser if it is NOT empty
                criteria = jqlParser.parse(queryString);
            }
            const count = await adapter.count(collectionName, criteria);

            return count;
        }

        /**
         * Searches for and Returns only ONE item.
         *
         * @param {string} queryString - A safe JQL string.
         * @param {object} options
         * @param {boolean} options.raw - if true, result will not be modelized. (But it will still respect the Jollof Id rule)
         * @param {object} options.paging
         * @param {number} options.paging.page
         * @param {number} options.paging.limit
         * @param {object} options.sort - e.g {fieldA: 1, fieldB: -1}. 1 is asc, -1 is desc
         * @returns {*}
         */
        static async findOne(queryString, options = {}) {

            const opts = _.clone(options);
            opts.paging = opts.paging || {};
            opts.paging.limit = 1;

            let res = await Model.find(queryString, opts);

            if (Array.isArray(res)) {
                res = res.length > 0 ? res[0] : null;
            }

            return res;
        }

        /**
         * Finds by json match
         * @param match json match
         * @param opts
         * @returns {Promise.<*>}
         */
        static async findBy(match, opts = {}) {

            const q = [];

            _.each(match, (v, k) => {
                q.push(jql`${k} = ${v}`);
            });

            let res = await Model.find(q.join(' and '), opts);

            return res;
        }

        /**
         * updates all matching condition with data.
         *
         * @param {string} queryString - A safe JQL string.
         * @param data
         *
         * @returns {*} A number signifying number of items updated.
         */
        static async update(queryString, data) {
            let criteria = [];

            if (queryString && queryString.trim && queryString.trim() != '') {
                //For now, we can only send a string into the jql parser if it is NOT empty
                criteria = jqlParser.parse(queryString);
            }

            const updateCount = await adapter.update(collectionName, criteria, data);
            return updateCount;
        }

        /**
         * Create or update something
         * @param data
         * @param params
         * @returns {*}
         */
        static async persist(data, params = {}) {

            const newItem = new Model(data);
            await newItem.save();

            const res = params.raw ? newItem.display() : newItem;
            return res;
        }

        /**
         * Delete all matching the criteria.
         * Will throw error if no conditions are given.
         * JollofJS will never wipe all your data unless env= test.
         *
         * @param queryString
         * @returns {*}
         */
        static async remove(queryString) {
            let criteria = [];
            if (queryString && queryString.trim && queryString.trim() != '') {
                //For now, we can only send a string into the jql parser if it is NOT empty
                criteria = jqlParser.parse(queryString);
            }
            else {
                throw new Boom.badRequest('Cannot remove with zero conditions. Please specify at least one condition to remove.')
            }

            return await adapter.remove(collectionName, criteria);
        }


        /**
         * Loads data into the model.
         *
         * @param data
         * @private
         */
        _loadData(data) {
            this._originalData = _.clone(data);
            this._data = _.clone(data);
        }

        isPersisted() {
            if (this._data.id)
                return true;
            else
                return false;
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

        async validate() {
            try {

                this._data = await isValidValidate(this._data, modelRules.schema, undefined, undefined);
            } catch (err) {
                throw err;
            }
        }

        //HOOKS

        async _preSave() {
            if (schema.hooks && schema.hooks.preSave) {
                await schema.hooks.preSave.bind(this)();
            }
        }

        async _preCreate() {
            if (schema.hooks && schema.hooks.preCreate) {
                await schema.hooks.preCreate.bind(this)();
            }
        }

        async _postSave() {
            if (schema.hooks && schema.hooks.postSave) {
                await schema.hooks.postSave.bind(this)();
            }
        }

        async _postCreate() {
            if (schema.hooks && schema.hooks.postCreate) {
                await schema.hooks.postCreate.bind(this)();
            }
        }

        async _preRemove() {
            if (schema.hooks && schema.hooks.preRemove) {
                await schema.hooks.preRemove.bind(this)();
            }
        }

        async _postRemove() {
            if (schema.hooks && schema.hooks.post && schema.hooks.postRemove) {
                await schema.hooks.postRemove.bind(this)();
            }
        }

        /**
         * Used internally and within this model instance's hooks to save itself.
         * Does not trigger hooks or validation
         * @private
         */
        async _save() {
            //const res = await adapter.saveModel(this);
            //return res;


            if (this.isPersisted()) {
                const where = jqlParser.parse(jql`id = ${this.id}`)

                await adapter.update(collectionName, where, this._data)
            }
            else {
                let res = await adapter.create(collectionName, this._data);
                this._loadData(res);
            }

            this._originalData = _.clone(this._data);
            //reload data
            //console.log('adapter.save', res);

            return this.display();
        }

        get id() {
            return this._data.id;
        }

        /**
         * Persists the model object in the DB
         * @returns {boolean}
         */
        async save() {
            try {

                if (this._isDeleted) throw new Error('Cannot save: Already deleted')

                // log.debug('Saving ' + schema.name);
                const creating = !this.isPersisted();

                this._preValidationData = _.cloneDeep(this._data);

                //pre
                if (creating) {
                    await this._preCreate();
                }
                await this._preSave();

                this._setTimestamps();
                //validate
                //try {
                await this.validate();
                //}
                //catch(validationError){
                //	log.debug(validationError);
                //	return {error: validationError};
                //}


                //Do actual save
                const res = await this._save();

                if (creating) {
                    await this._postCreate();
                }
                await this._postSave();

                //by now we should be done with preValidationData
                delete this._preValidationData;


                //log.debug('ids', 'data', this._data);

                return res;
            } catch (err) {
                if (!err.isOperational) {
                    log.error(err.stack);
                }

                throw err;
            }
        }

        /**
         * Marks this item as deleted.
         * Severs ties with stuff and prepare this object as much as possible for GC.
         * @private
         */
        _markDeleted() {

            this._data = null;
            this._isDeleted = true;
        }

        /**
         * Delete this item from the database
         * @returns {boolean}
         */
        async remove() {

            await this._preRemove();

            const where = jqlParser.parse(jql`id = ${this.id}`)
            await adapter.remove(model._collectionName, where);
            //await adapter.removeModel(this);

            await this._postRemove();

            this._markDeleted();
            return true;
        }

        /**
         * The json representation of this model's combined data.
         */
        display() {
            let disp = _.cloneDeep(this._data);

            return disp;
        }

        toString() {
            return JSON.stringify(this.display());
        }

        static async runNativeQuery(queryName, params) {
            if (schema.nativeQueries && schema.nativeQueries[queryName] && schema.nativeQueries[queryName][connectorName]) {
                let queryFunc = schema.nativeQueries[queryName][connectorName];
                return await queryFunc(params, adapter._db);
            }
            else {
                log.error(`${schema.name}: No such native query '${queryName}' exists for the ${connectorName} engine. Did you forget to create it?`)
            }
        }

    };


    /**
     * setup methods
     */
    _.each(schema.methods, (v, k) => {
        Model[k] = v;
    })


    /**
     * Setup native functions
     */
    if (schema.native) {
        //First grab the set of native functions by this Collection's active native type.
        // A collection can only have 1 active native type per run.
        const activeNativeFunctions = schema.native[activeNativeType];

        //Put native funcs in addapter's context by Binding
        for (let funcName in activeNativeFunctions) {
            activeNativeFunctions[funcName] = activeNativeFunctions[funcName].bind(adapter.getBindable ? adapter.getBindable() : adapter)
        }

        const nativeProxyAcessor = {
            set (target, key, value) {

                throw new Error('You cannot set a Jollof Native function')

                return false;
            },
            get (target, key) {

                //if key exists in data's keys, get from there. otherwise get from the model
                if (activeNativeFunctions[key])
                    return activeNativeFunctions[key];
                else
                    throw new Error(`The native function '${key}' has not been defined for nativeType '${activeNativeType}' in model '${collectionName}'`)
            }
        };

        const nativeProxy = new Proxy({}, nativeProxyAcessor);
        Model.native = nativeProxy;
    }
    else {
        //in-case a model has static native overriden via methods
        Model.native = Model.native || {};
    }


    // This way we can new jollof.models.user({firstName:'Joe'})
    return Model;
};