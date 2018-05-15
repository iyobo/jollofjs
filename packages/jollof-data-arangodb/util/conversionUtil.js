/**
 * Created by iyobo on 2017-05-02.
 */
const idField = '_key';
const assert = require('assert');
const aql = require('arangojs').aql;
const util = require('util')
const moment = require('moment')

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
            throw new Error('Cannot handle "like" operator here. Do so in native functions')
            break;
        case 'nlike':
            throw new Error('Cannot handle "nlike" operator here. Do so in native functions')
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

        //field
        let fieldName = cond[0];
        if (fieldName === 'id') {
            fieldName = '_key';
        }

        let isNestedQuery = false;
        if (fieldName.indexOf('*') > -1) {
            fieldName = fieldName.replace('.*', '[*]');
            isNestedQuery = true;
        }

        //comp/value
        let comp = cond[1];
        let value = cond[2];

        if (value)

        // construct mini block
            if (comp === 'like' || comp === 'nlike') {

                value = '%' + value + '%';

            }
        const paramIndex = Math.floor(Object.keys(queryObj.bindVars).length / 2);

        const paramName = 'p' + paramIndex;
        const valueName = 'v' + paramIndex;

        const aqlComp = convertComp(comp);

        //appendants
        if (value) {

            //NOTE: unfortunatlely, dynamic queries cannot handle nested fields as at Arango 3.1

            if (isNestedQuery) {
                // FIXME: secure the fieldName variable before using point blank!!! VERY prone to AQL/SQL injection right now.
                const safeFieldName = fieldName
                result = ` c.${safeFieldName} ANY ${aqlComp} @${valueName} `;
            } else {

                result = ` c.@${paramName} ${aqlComp} @${valueName} `;
                queryObj.bindVars[paramName] = fieldName;
            }

        }

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
function translateAndList(conds, queryObj, op) {
    assert(Array.isArray(conds), 'Expected an array to AND. Instead got ' + typeof conds);

    let ff = ' ( '
    const andList = [];
    conds.forEach((cond) => {
        andList.push(translate(cond, queryObj))
    });
    ff += andList.join(op || ' AND ') + ' ) '
    //console.log('and', ff)
    return ff;
}

/**
 *
 * @param conds
 * @param queryObj
 * @returns {string}
 */
function translateOrList(conds, queryObj, op) {
    assert(Array.isArray(conds), 'Expected an array to OR. Instead got ' + typeof conds);

    let ff = ' ( '
    const orList = [];
    conds.forEach((cond) => {
        orList.push(translate(cond, queryObj))
    });
    ff += orList.join(op || ' OR ') + ' ) '
    //console.log('or', ff)
    return ff;
}


/**
 * Converts an array of jollof conditions to native query language
 * @param {Array} jollofArray
 * @param queryObj
 * @returns ArangoDB string query
 */
exports.convertConditionsFromJollof = (jollofArray, queryObj) => {
    try {
        const q = translateAndList(jollofArray, queryObj, ' && ');

        queryObj.query += q;
        //console.log({ q })
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