/**
 * Created by iyobo on 2016-10-30.
 */
const co = require('co');
const _ = require('lodash');
const path = require('path');
const promise = require('bluebird');

const Datastore = require('nedb-jollof')
var convertConditionsFromJollof = require('./util/conversionUtil.js').convertConditionsFromJollof;

/**
 * A Jollof Data Adapter for Memory
 */
class JollofDataMemory {

    /**
     * Keep constructor free of async calls.
     * Only use to set initial values like connection strings and similar sync commands.
     * @param options
     */
    constructor(options) {
        this._connectionOptions = options || {};
        this._db = {};
    }


    /**
     * Jollof will run this on boot. Place all async or 'talking to database per collection' logic here.
     *
     * @param schema
     */
    * addSchema(schema) {

        //options are different each time because same adapter managers multiple stores/collections
        const options = _.cloneDeep(this._connectionOptions)
        options.filename = path.join(this._connectionOptions.filename, schema.name + '.db')
        this._db[schema.name] = promise.promisifyAll(new Datastore(options));
        return true;
    }


    /**
     * This is the primary Id field name to be used in all models under this adapter.
     * @returns {string}
     */
    get idField() {
        return '_id';
    }

    /**
     * These are fields that this adapter's datasource needs, but that might not relate to Jollof.
     * Jollof might use this to know and preserve these fields.
     *
     * @returns {string}
     */
    get keepFields() {
        return [];
    }


    /**
     * convert _id to id
     * @param res
     */
    _convertToJollof(res) {
        if (Array.isArray(res)) {
            res = res.map((row) => {
                row.id = row[this.idField];
                delete row[this.idField];

                return row;
            });
        } else {
            if (res[this.idField]) {
                res.id = res[this.idField];
                delete res[this.idField];
            }
        }
        return res;
    }


    /**
     *
     * @param collectionName
     * @param criteria
     * @param opts
     * @returns {*}
     */
    * find(collectionName, criteria, opts = {}) {
        //If we're paging
        let res;
        if (opts) {

            const options = {};

            if (opts.paging) {
                const page = opts.paging.page || 1;
                const limit = opts.paging.limit || 10;
                const skip = ((page - 1) * limit);

                options.paging = { skip, limit };
            }

            if (opts.sort) {
                options.sort = opts.sort;
            }

            res = yield this._db[collectionName].findOptsAsync(convertConditionsFromJollof(criteria), options);
        } else {
            res = yield this._db[collectionName].findAsync(convertConditionsFromJollof(criteria));
        }
        return res;

    }

    /**
     *
     * @param collectionName
     * @param criteria
     * @param opts
     * @returns {*}
     */
    * count(collectionName, criteria, opts) {
        return yield this._db[collectionName].countAsync(convertConditionsFromJollof(criteria));
    }


    /**
     *
     * @param collectionName
     * @param criteria
     * @param newValues
     * @param params
     * @returns {*}
     */
    * update(collectionName, criteria, newValues, opts) {
        opts = this._convertFromJollof(opts);
        return yield this._db[collectionName].updateAsync(this._convertFromJollof(criteria), newValues);
    }


    /**
     *
     * @param collectionName
     * @param criteria
     * @param newValues
     * @param params
     * @returns {*}
     */
    * create(collectionName, data) {

        const res = yield this._db[collectionName].insertAsync(data);
        return this._convertToJollof(res);
    }


    /**
     * Deletes all rows that match the criteria.
     * @param collectionName
     * @param criteria
     * @param params
     * @returns {*}
     */
    * remove(collectionName, criteria, opts) {

        _.merge(opts, { multi: true })
        return yield this._db[collectionName].removeAsync(this._convertFromJollof(criteria), opts);

    }

}

module.exports = JollofDataMemory;