/**
 * Created by iyobo on 2016-10-30.
 */
const _ = require('lodash');


const Database = require('arangojs').Database;

const convertToJollof = require('./util/conversionUtil.js').convertToJollof;
const convertConditionsFromJollof = require('./util/conversionUtil.js').convertConditionsFromJollof;

const connPool = {};

/**
 * A factory of different ArangoDB connections based on URL
 * @param url
 * @returns {Promise<*>}
 */
async function getConnection(url) {

    if (connPool[url]) {
        return connPool[url];
    } else {
        const conn = new Database(url)
        connPool[url] = conn;
        return conn;
    }

}

/**
 * A Jollof Data Adapter for MongoDB using mongoose.
 */
class JollofDataMongoDB {

    /**
     * Keep constructor free of async calls.
     * Only use to set initial values like connection strings and similar sync commands.
     * @param options
     */
    constructor(options) {

        this.connectionOptions = options || {};

        this._convertConditionsFromJollof = convertConditionsFromJollof;
        this._convertToJollof = convertToJollof;
    }

    async ensureDatabaseExists(opts) {

    }

    async ensureConnection() {
        const url = this.connectionOptions.url || 'http://127.0.0.1:8529';
        const opts = this.connectionOptions.opts || {};

        this.db = await getConnection(url, opts);
        this.db = ensureDatabaseExists(opts);
    }

    /**
     * Jollof will run this on boot. Place all async or 'talking to database per collection' logic here.
     *
     * @param schema
     */
    async addSchema(schema) {

        //Because this is ArangoDB, there is no need to do a whole lot here.
        //Just ensure the necessary connection is cached.
        await this.ensureConnection();
        return true;
    }


    /**
     * This is the primary Id field name to be used in all models under this adapter.
     * @returns {string}
     */
    get idField() {
        return '_key';
    }

    /**
     * This is the primary Id type
     * @returns {*}
     */
    static get IdType() {
        return String;
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
     * Return the created item
     * @param collectionName
     * @param criteria
     * @param newValues
     * @param params
     * @returns {*}
     */
    async create(collectionName, data) {

        //await this.ensureConnection();
        const res = await this.db.collection(collectionName).insertOne(data);
        return convertToJollof(res.ops[0]);
    }


    /**
     *
     * @param collectionName
     * @param criteria
     * @param opts
     * @returns {*}
     */
    async find(collectionName, criteria, opts = {}) {
        //await this.ensureConnection();
        //If we're paging
        let res;

        const params = convertConditionsFromJollof(criteria);

        //console.log(params)

        let cursor = this.db.collection(collectionName).find(params);

        if (opts) {

            if (opts.paging) {
                const page = opts.paging.page || 1;
                const limit = opts.paging.limit || 10;
                const skip = ((page - 1) * limit);

                cursor = cursor.skip(skip);
                cursor = cursor.limit(limit);
            }

            if (opts.sort) {
                cursor = cursor.sort(opts.sort)
            }

        }

        res = await cursor.toArray();
        return convertToJollof(res);

    }

    /**
     *
     * @param collectionName
     * @param criteria
     * @param opts
     * @returns {*}
     */
    async count(collectionName, criteria, opts) {
        //await this.ensureConnection();
        return await this.db.collection(collectionName).count(convertConditionsFromJollof(criteria));
    }


    /**
     * Return how many items were updated
     * @param collectionName
     * @param criteria
     * @param newValues
     * @param params
     * @returns {number} - How many were updated
     */
    async update(collectionName, criteria, newValues, opts) {
        //await this.ensureConnection();
        //opts = convertFromJollof(opts);
        const q = convertConditionsFromJollof(criteria);
        const res = await this.db.collection(collectionName).updateMany(q, { $set: newValues });
        //console.log('item update result', res);
        return res.modifiedCount;
    }


    /**
     * Deletes all rows that match the criteria.
     * Return number of items deleted
     *
     * @param collectionName
     * @param criteria
     * @param params
     * @returns {number}
     */
    async remove(collectionName, criteria, opts) {
        //await this.ensureConnection();
        _.merge(opts, { multi: true })
        const res = await this.db.collection(collectionName).deleteMany(convertConditionsFromJollof(criteria), opts);

        return res.deletedCount;

    }

}

module.exports = JollofDataMongoDB;