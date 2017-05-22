/**
 * Created by iyobo on 2017-05-02.
 */
const idField = '_id';
const Boom = require('boom');
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
        case 'not in':
            symbol = '$nin';
            break;

    }

    return symbol;
}


function translate(cond, query, parentConnector) {

    let fieldName = cond.field;

    if(fieldName === 'id'){
        fieldName = '_id';
        cond.value = new ObjectID(cond.value)
    }

    //We don't support elemMatch fields
    if (fieldName.indexOf('*') > -1) {
        throw new Boom.methodNotAllowed('Sub-array matches not supported in jollof-data-memory adapter');
    }


    if (!cond.items) { // if not a nest starter

        const condBlock = {};

        // construct mini block
        if (cond.comp === '=') {
            let value = cond.value;

            //NEDB is too dumb to deal with foo:null
            if (cond.value === null || cond.value === undefined) {
                value = {};
                value['$exists'] = false;
            }

            condBlock[fieldName] = value;
        } else if (cond.comp === '!=' && (cond.value === null || cond.value === undefined)) {
            let value = {};
            value['$exists'] = true;

            condBlock[fieldName] = value;
        }
        else {
            const subCondBlock = {};
            subCondBlock[convertComp(cond.comp)] = cond.value;

            //construct block
            condBlock[fieldName] = subCondBlock;
        }


        //how is this block connected to the previous?
        const logical = '$' + (cond.connector || parentConnector || 'and');
        query[logical] = query[logical] || [];
        query[logical].push(condBlock);

    }
    else if (cond.items) {
        throw new Boom.methodNotAllowed('Nested conditions currently unsupported in Jollof Memory Adapter')
    }

    return cond.connector;

}

function translateList(conds, map) {
    let activeConnector;
    conds.reverse().forEach((cond, index) => {
        activeConnector = translate(cond, map, activeConnector);
    });
}

exports.convertConditionsFromJollof = (conditions) => {
    const query = {};

    translateList(conditions, query);

    //console.log('conditions:', conditions, 'query:', query);

    return query;
}


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