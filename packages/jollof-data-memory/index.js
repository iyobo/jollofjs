/**
 * Created by iyobo on 2016-10-30.
 */
const co = require('co');
const _ = require('lodash');
const path = require('path');
const promise = require('bluebird');

const Datastore = require('nedb-jollof')

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
    * configureCollection(schema) {

        //options are different each time because same adapter managers multiple stores/collections
        const options = _.cloneDeep(this._connectionOptions)
        options.filename = path.join(this._connectionOptions.filename, schema.name + '.db')
        this._db[schema.name] = promise.promisifyAll(new Datastore(options));
        return true;
    }


    /**
     * Return an array of OTHER meta fields this database uses, besides the mainId.
     *
     * Jollof models do not store id fields and data in the same internal object, but keeps it
     * seperate in order to support databases that expect Id fields be passed to them
     * as meta seperate from the data (e.g. ArangoDB).
     *
     * The complete list of Id fields are used to configure the Jollof Model's accessor object.
     * e.g So it knows modelInstance._key is a valid reference that should be forwarded to modelInstance._ids._key
     * @returns {string[]}
     */
    get metafields() {
        return []
    }

    /**
     * This is the primary Id field name to be used in all models under this adapter.
     * @returns {string}
     */
    get idField() {
        return '_id';
    }

    /**
     * Implement this to convert jollofQL to whatever you need.
     * @param query
     * @returns {*}
     * @private
     */
    _processQuery(query) {
        return query;
    }

    /**
     * convert _id to id
     * @param res
     */
    decorateResponse(res) {
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
     * Get a single item by it's id
     * @param collectionName
     * @param id
     * @returns {string}
     */
    * findById(collectionName, id, params) {
        try {
            const res = yield this._db[collectionName].findOneAsync({ _id: id });

            return this.decorateResponse(res);
        } catch (err) {
            throw err;
        }
    }

    /**
     *
     * @param collectionName
     * @param criteria
     * @param params
     * @returns {*}
     */
    * findOne(collectionName, criteria, params) {
        const res = yield this._db[collectionName].findOneAsync(this._processQuery(criteria));
        return this.decorateResponse(res);
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

            res = yield this._db[collectionName].findOptsAsync(this._processQuery(criteria), options);
        } else {
            res = yield this._db[collectionName].findAsync(this._processQuery(criteria));
        }
        this.decorateResponse(res);
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
        return yield this._db[collectionName].countAsync(this._processQuery(criteria));
    }

    /**
     *
     * @param collectionName
     * @param criteria
     * @param params
     * @returns {*}
     */
    * findQL(collectionName, query, opts) {

        try {

            const res = yield this._db[collectionName].findAsync(this._processQuery(query));

            return {
                items: this.decorateResponse(res),
                count: res.length
            }
        }
        catch (err) {
            throw err;
        }
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
        opts = this._processQuery(opts);
        return yield this._db[collectionName].updateAsync(this._processQuery(criteria), newValues);
    }


    /**
     *
     * @param collectionName
     * @param criteria
     * @param newValues
     * @param params
     * @returns {*}
     */
    * create(collectionName, data, params) {

        const res = yield this._db[collectionName].insertAsync(data);
        return this.decorateResponse(res);
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
        return yield this._db[collectionName].removeAsync(this._processQuery(criteria), opts);

    }


    /**
     * persists the model's current state.
     *
     * Each adapter is responsible for deciding whether it should be a create or an update depending on
     * how it's database handles either.
     *
     * Each adapter is also responsible for setting the appropriate new values in the model.
     * In this case, all that gets set is the _ids as this DB prefers keeping _data and _ids seperate.
     *
     * @param model
     */
    * saveModel(model) {
        let res;
        if (model.isPersisted()) {
            res = yield this.update(model._collectionName, { _id: model.id }, model._data)
        }
        else {
            res = yield this.create(model._collectionName, model._data);
            model._loadData(res);
        }

        //reload data
        console.log('adapter.save', res);

        return model.display();
    }

    * removeModel(model) {
        return yield this.remove(model._collectionName, { _id: model.id })
    }

    * runQuery(collectionName, queryFunc, params) {
        let q = queryFunc(params);
        const cursor = yield this._db.query(q.query)

        return q.type === 'GET_ONE' ? cursor.next() : cursor.all();
    }
}

//Export a singleton of this adapter
let adapterSingleton;
module.exports = (options) => {
    if (!adapterSingleton)
        adapterSingleton = new JollofDataMemory(options);

    return adapterSingleton;
}