/**
 * Created by iyobo on 2017-05-02.
 */

function convertComp(comp){

    let symbol ='';

    switch(comp){
        case '=':
            symbol = '$eq';
            break;
        case '>':
            symbol = '$gt';
            break;
        case '<':
            symbol = '$lt';
            break;

    }

    return comp;
}


function translate(cond, query) {

    if (!cond.items) { // if not a nest starter

        // construct mini block
        const c = {};
        c[convertComp(cond.comp)] = cond.value;

        //construct block
        const v = {};
        v[cond.field] = c;

        //how is this block connected to the previous?
        const logical = '$'+(cond.connector || 'and');
        query[logical] =  query[logical] || [];
        query[logical] = v;

    }
    else (cond.items)
    {

    }

}

function translateList(conds, map) {
    conds.forEach((cond, index) => {
        translate(cond, map);
    });
}
exports.convertConditionsFromJollof = (conditions) => {
    const query = {};

    translateList(conditions.query);

    return query;
}


exports.convertOptionsFromJollof = (opts) => {
    return opts;
}