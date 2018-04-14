/**
 * Created by iyobo on 2016-10-30.
 */
const _ = require('lodash');
const boom = require('boom')

const arangojs = require('arangojs');
const Database = arangojs.Database;
const aql = arangojs.aql;

const convertToJollof = require('./util/conversionUtil.js').convertToJollof;
const convertConditionsFromJollof = require('./util/conversionUtil.js').convertConditionsFromJollof;

const connPool = {};

/**
 * A factory of different ArangoDB connections based on URL
 * @param url
 * @returns {Promise<*>}
 */
async function getConnection(url, opts = {}) {

    const dbName = opts.databaseName;
    if (!dbName || dbName === '')
        throw boom.badImplementation('jollof-data-arangodb: databaseName config is required', { url, opts })

    const key = url + dbName;

    //Get connection
    let connection;
    if (connPool[key]) {
        connection = connPool[key];
    } else {
        connection = new Database(url)
        connPool[key] = connection;
    }

    //Now ensure database exists
    const dbNames = await connection.listDatabases();
    if (dbNames.indexOf(dbName) > -1) {
        //our db exists. use it.
        connection.useDatabase(dbName)
    } else {
        //our db does not exist. Attempting to create it
        await connection.createDatabase(dbName, [{ username: opts.username, passw: opts.password }])
        connection.useDatabase(dbName)
    }

    return connection;
}

/**
 * A Jollof Data Adapter for ArangoDB using ArangoJS.
 */
class JollofDataArangoDB {

    /**
     * Keep constructor free of async calls.
     * Only use to set initial values like connection strings and similar sync commands.
     * @param options
     */
    constructor(options) {

        this.connectionOptions = options || {};

        this.convertConditionsFromJollof = convertConditionsFromJollof;
        this.convertToJollof = convertToJollof;

        this.arangojs = arangojs;
        this.aql = arangojs.aql;
    }

    async ensureConnection() {
        const url = this.connectionOptions.url || 'http://127.0.0.1:8529';
        const opts = this.connectionOptions || {};

        this.db = await getConnection(url, opts);
    }

    /**
     * Jollof will run this on boot. Place all async or 'talking to database per collection' logic here.
     *
     * @param schema
     */
    async addSchema(schema) {

        await this.ensureConnection();

        //add collection
        try {
            await this.db.collection(schema.name).get();
        }
        catch (ex) {
            await this.db.collection(schema.name).create();
        }

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
        return ['_id', '_rev'];
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
        const collection = this.db.collection(collectionName);
        const query = aql`INSERT ${data} IN ${collection}  RETURN NEW`;

        try {
            const cursor = await this.db.query(query);
            const result = await cursor.next();
            //console.log({ result })
            return convertToJollof(result);
        } catch (e) {
            console.error('There was an issue creating wth the AQL query ', query)
            throw new Error(e);
        }

    }

    /**
     *
     * @param collectionName
     * @param criteria
     * @param opts
     * @returns {*} Ana rray of items or empty array
     */
    async find(collectionName, criteria, opts = {}) {

        const queryObj = {
            query: `For c IN @@collectionName 
             ${criteria.length > 0 ? 'FILTER' : ''} `,
            bindVars: { '@collectionName': collectionName }
        }
        if (criteria.length > 0)
            convertConditionsFromJollof(criteria, queryObj);

        if (opts) {

            if (opts.paging) {
                const page = opts.paging.page || 1;
                const count = opts.paging.limit || 10;
                const offset = ((page - 1) * count);

                queryObj.query += `LIMIT ${offset ? '@offset,' : ''} @count `;
                if (offset)
                    queryObj.bindVars['offset'] = offset
                queryObj.bindVars['count'] = count

            }

            if (opts.sort) {
                queryObj.query += ' SORT '
                _.each(opts.sort, (v, k) => {
                    queryObj.query += `c.@sortField ${v > 0 ? '' : 'DESC'} `;
                    queryObj.bindVars['sortField'] = k !== 'id' ? k : this.idField
                })
            }
        }
        queryObj.query += ` RETURN c `;

        try {
            //console.log({ queryObj })
            const cursor = await this.db.query(queryObj);

            let rawResult = await cursor.all();
            //console.log({ rawResult })
            const results = convertToJollof(rawResult);
            //console.log({ results })
            return results;
        } catch (e) {
            console.error('There was an issue finding items with the AQL query ', queryObj)
            throw new Error(e);
        }

    }

    /**
     *
     * @param collectionName
     * @param criteria
     * @param opts
     * @returns {*}
     */
    async count(collectionName, criteria, opts) {

        const queryObj = {
            query: `For c IN @@collectionName 
            ${criteria.length > 0 ? 'FILTER' : ''} `,
            bindVars: { '@collectionName': collectionName }
        }
        if (criteria.length > 0)
            convertConditionsFromJollof(criteria, queryObj);
        queryObj.query += ` COLLECT WITH COUNT INTO length   RETURN length `;

        try {
            const cursor = await this.db.query(queryObj);
            const count = await cursor.next();
            return count;
        } catch (e) {
            console.error('There was an issue counting with the AQL query ', queryObj)
            throw new Error(e);
        }
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

        const queryObj = {
            query: `For c IN @@collectionName
            ${criteria.length > 0 ? 'FILTER' : ''} `,
            bindVars: { '@collectionName': collectionName }
        }
        if (criteria.length > 0)
            convertConditionsFromJollof(criteria, queryObj);
        queryObj.query += ` UPDATE c WITH @newValues IN @@collectionName`;
        queryObj.bindVars['newValues'] = newValues;

        try {
            const cursor = await this.db.query(queryObj);
            const result = await cursor.next();
            return convertToJollof(result);
        } catch (e) {
            console.error('There was an issue updatng with the AQL query ', queryObj)
            throw new Error(e);
        }
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

        const queryObj = {
            query: `For c IN @@collectionName
            FILTER `,
            bindVars: { '@collectionName': collectionName }
        }
        convertConditionsFromJollof(criteria, queryObj);
        queryObj.query += ` REMOVE c IN @@collectionName`;

        try {
            const cursor = await this.db.query(queryObj);
            const result = await cursor.next();
            return convertToJollof(result);
        } catch (e) {
            console.error('There was an issue removing the AQL query ', queryObj)
            throw new Error(e);
        }

    }

}

module.exports = JollofDataArangoDB;