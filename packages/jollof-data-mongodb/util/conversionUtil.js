/**
 * Created by iyobo on 2017-05-02.
 */
const idField = '_id';
const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;

function convertComp(comp) {

    let symbol = '';

    switch (comp) {
        case '>':
            symbol = '$gt';
            break;
        case '!=':
            symbol = '$ne';
            break;
        case '>=':
            symbol = '$gte';
            break;
        case '<':
            symbol = '$lt';
            break;
        case '<=':
            symbol = '$lte';
            break;
        case 'in':
            symbol = '$in';
            break;
        case 'nin':
            symbol = '$nin';
            break;

    }

    return symbol;
}

/**
 * Translates a single jollof condition
 * @param {array | object} cond
 * @returns {*}
 */
function translate(cond) {

    let result = {};

    // If condition is not an array...
    if (!Array.isArray(cond)) {
        //...then it is a condition cluster
        if (cond.and) {
            result = translateAndList(cond.and)
        }
        else if (cond.or) {
            result = translateOrList(cond.or)
        }
        else {
            //This is an illegal subject.
            throw new Error('Invalid query Object keys. Objects must be either "and" or "or"');
        }
    }
    else {
        //...then it's a singular condition
        assert(cond.length === 3, 'Invalid condition item. Condition items must be an array of 3 items representing field, comparator, and value')

        let fieldName = cond[0];
        let comp = cond[1];
        let value = cond[2];

        if (fieldName === 'id') {
            fieldName = '_id';
            value = new ObjectID(value)
        }

        // construct mini block
        if (comp === '=') {

            if (value === null || value === undefined) {
                value = {};
                value['$exists'] = false;
            }

            result[fieldName] = value;
        } else if (comp === '!=' && (value === null || value === undefined)) {
            let value = {};
            value['$exists'] = true;

            result[fieldName] = value;
        }
        else {
            const subCondBlock = {};

            subCondBlock[convertComp(comp)] = value;

            result[fieldName] = subCondBlock;
        }
    }

    return result;

}

function translateAndList(conds) {
    assert(Array.isArray(conds), 'Expected an array to AND. Instead got ' + typeof conds);

    const andList = [];
    conds.forEach((cond) => {
        andList.push(translate(cond));
    })
    return andList.length > 0 ? { $and: andList } : {};
}

function translateOrList(conds) {
    assert(Array.isArray(conds), 'Expected an array to OR. Instead got ' + typeof conds);

    const orList = [];
    conds.forEach((cond) => {
        orList.push(translate(cond));
    })

    return orList.length > 0 ? { $or: orList } : {};
}


/**
 * Converts an array of jollof conditions to MongoDB
 * @param {Array} jollofArray
 * @returns MongoDB query
 */
exports.convertConditionsFromJollof = (jollofArray) => {
    try {
        return translateAndList(jollofArray);
    } catch (e) {
        console.error('jollof-data-mongodb: Trouble processing ', jollofArray);
        throw e;
    }

}

/**
 * Converts paging and sorting options
 * @param opts
 * @returns {*}
 */
exports.convertOptionsFromJollof = (opts) => {

    if (opts.sort && opts.sort.id) {
        opts.sort._id = opts.sort.id;
        delete opts.sort.id;
    }

    return opts;
}

exports.convertToJollof = (res) => {
    if (Array.isArray(res)) {
        res = res.map((row) => {
            row.id = row[idField];
            delete row[idField];

            return row;
        });
    } else {
        if (res[idField]) {
            res.id = res[idField];
            delete res[idField];
        }
    }

    return res;
}