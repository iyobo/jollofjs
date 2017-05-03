/**
 * Created by iyobo on 2017-05-02.
 */

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


function translate(cond, query, parentConnector) {

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

            condBlock[cond.field] = value;
        } else if(cond.comp === '!=' && (cond.value === null || cond.value === undefined)){
            let value = {};
            value['$exists'] = true;

            condBlock[cond.field] = value;
        }
        else {
            const subCondBlock = {};
            subCondBlock[convertComp(cond.comp)] = cond.value;


            //construct block
            condBlock[cond.field] = subCondBlock;
        }


        //how is this block connected to the previous?
        const logical = '$' + (cond.connector || parentConnector || 'and');
        query[logical] = query[logical] || [];
        query[logical].push(condBlock);

    }
    else (cond.items)
    {

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

    console.log('conditions:', conditions, 'query:', query);

    return query;
}


exports.convertOptionsFromJollof = (opts) => {
    return opts;
}