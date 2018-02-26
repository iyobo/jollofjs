/**
 * Created by iyobo on 2016-10-30.
 */
const _ = require('lodash');

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;

const convertToJollof = require('./util/conversionUtil.js').convertToJollof;
const convertConditionsFromJollof = require('./util/conversionUtil.js').convertConditionsFromJollof;

const connPool = {};

async function getConnection(url) {

    if (connPool[url]) {
        return connPool[url];
    } else {
        const conn = await MongoClient.connect(url, {
            poolSize: 3
        });
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

        this._MongoClient = MongoClient;
        this._convertConditionsFromJollof = convertConditionsFromJollof;
        this._convertToJollof = convertToJollof;
        this.ObjectId = ObjectId;
    }

    async ensureConnection() {
        const url = this.connectionOptions.mongoUrl || 'mongodb://localhost/nodb';
        const opts = this.connectionOptions.opts || { poolSize: 10 };

        this.db = await getConnection(url, opts);
    }

    /**
     * Jollof will run this on boot. Place all async or 'talking to database per collection' logic here.
     *
     * @param schema
     */
    async addSchema(schema) {

        //Because this is mongo, there is no need to do a whole lot here.
        //Just ensure the necessary connection is cached.
        await this.ensureConnection();
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
     * This is the primary Id type
     * @returns {*}
     */
    static get IdType() {
        return ObjectId;
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

        console.log(params)

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