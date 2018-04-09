/**
 * Created by iyobo on 2017-05-02.
 */
const idField = '_key';
const assert = require('assert');
const aql = require('arangojs').aql;
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
 * @param queryObj
 * @returns {*}
 */
function translate(cond, queryObj) {

    let result = {};

    // If condition is not an array...
    if (!Array.isArray(cond)) {
        //...then it is a condition cluster
        if (cond.and) {
            result = translateAndList(cond.and, queryObj)
        }
        else if (cond.or) {
            result = translateOrList(cond.or, queryObj)
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
        fieldName = fieldName.replace('.*', '[*]');

        let comp = cond[1];
        let value = cond[2];

        // construct mini block
        if (comp === 'like' || comp === 'nlike') {

            value = '%' + value + '%';

        }

        const paramName = 'p' + Object.keys(queryObj.bindVars).length;
        const valueName = 'v' + Object.keys(queryObj.bindVars).length;

        const aqlComp = convertComp(comp);

        result = `c.@${paramName} ${aqlComp} @${valueName}`;

        queryObj.bindVars[paramName] = fieldName;
        queryObj.bindVars[valueName] = value;

    }

    return result;

}

/**
 *
 * @param conds
 * @param queryObj
 * @returns {string}
 */
function translateAndList(conds, queryObj) {
    assert(Array.isArray(conds), 'Expected an array to AND. Instead got ' + typeof conds);

    queryObj.query += ' ( '
    const andList = [];
    conds.forEach((cond) => {
        andList.push(translate(cond, queryObj))
    });
    queryObj.query += andList.join(' AND ')
    queryObj.query += ' ) '
}

/**
 *
 * @param conds
 * @param queryObj
 * @returns {string}
 */
function translateOrList(conds, queryObj) {
    assert(Array.isArray(conds), 'Expected an array to OR. Instead got ' + typeof conds);

    queryObj.query += ' ( '
    const orList = [];
    conds.forEach((cond) => {
        orList.push(translate(cond, queryObj))
    });
    queryObj.query += orList.join(' OR ')
    queryObj.query += ' ) '

}


/**
 * Converts an array of jollof conditions to native query language
 * @param {Array} jollofArray
 * @param queryObj
 * @returns ArangoDB string query
 */
exports.convertConditionsFromJollof = (jollofArray, queryObj) => {
    try {
        translateAndList(jollofArray, queryObj);

        //console.log('The query:', util.inspect(resp))

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
    } else if (res) {
        if (res[idField]) {
            res.id = res[idField];
            delete res[idField];
        }
    }

    return res;
}