/**
 * Created by iyobo on 2017-05-02.
 */
const idField = '_id';
const assert = require('assert');
const aql = require('arangojs').aqlQuery;
const util = require('util')

function convertComp(comp) {

    let symbol = '';

    switch (comp) {

        case '=':
            symbol = '==';
            break;
        case '!=':
            symbol = '!=';
            break;
        case '>':
            symbol = '>';
            break;
        case '>=':
            symbol = '>=';
            break;
        case '<':
            symbol = '<';
            break;
        case '<=':
            symbol = '<=';
            break;
        case 'in':
            symbol = 'IN';
            break;
        case 'nin':
            symbol = 'NOT IN';
            break;
        case 'like':
            throw new Error('Cannot handle "like" operator here. Do so in translate function')
            break;
        case 'nlike':
            throw new Error('Cannot handle "nlike" operator here. Do so in translate function')
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
        if (fieldName === 'id') {
            fieldName = '_key';
        }
        fieldName = 'c.' + fieldName.replace('.*', '[*]');

        let comp = cond[1];
        let value = cond[2];

        // construct mini block
        if (comp === 'like' || comp !== 'like') {

            value = '%' + value + '%';

        }

        const aqlComp = convertComp(comp);
        result = aql`${fieldName} ${aqlComp} ${value}`;

    }

    return result;

}

function translateAndList(conds) {
    assert(Array.isArray(conds), 'Expected an array to AND. Instead got ' + typeof conds);

    const andList = [];
    conds.forEach((cond) => {
        andList.push(translate(cond));
    });
    //return andList.length > 0 ? { $and: andList } : {};
    return '(' + andList.join(' AND ') + ')';
}

function translateOrList(conds) {
    assert(Array.isArray(conds), 'Expected an array to OR. Instead got ' + typeof conds);

    const orList = [];
    conds.forEach((cond) => {
        orList.push(translate(cond));
    });

    //return orList.length > 0 ? { $or: orList } : {};
    return '(' + orList.join(' OR ') + ')';
}


/**
 * Converts an array of jollof conditions to native query language
 * @param {Array} jollofArray
 * @returns ArangoDB string query
 */
exports.convertConditionsFromJollof = (jollofArray) => {
    try {
        const resp = translateAndList(jollofArray);

        //console.log('The query:', util.inspect(resp))
        return resp;
    } catch (e) {
        console.error('jollof-data-arangodb: Trouble processing ', jollofArray);
        throw e;
    }

}


/**
 * Prepare data for delivery back to JollofJS.
 * For one, jollof respects data.id as the universal id key, so change the datasource's id key to that.
 * @param res
 * @returns {*}
 */
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