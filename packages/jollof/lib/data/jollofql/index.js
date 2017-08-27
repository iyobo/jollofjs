const jollofql = require('./jollofql');
const parser = jollofql.parser;


function cleanString(value) {
    const v = value.replace(/"/g, '\"');

    return '"' + v + '"';
}

/**
 * A tag to be used with ES6 string literals to prevent JQL injection.
 * Helps to build JQL queries.
 *
 * @param queryChunks
 * @param injects
 * @returns {string}
 */
function jql(queryChunks, ...injects) {
    try {
        let res = '';


        for (let i = 0; i < injects.length; i++) {

            let value = injects[i];
            let q = queryChunks[i];

            if (typeof value === 'string') {
                //make string value safe

                value = cleanString(value);
            }
            else if (Array.isArray(value)) {

                //We do not support nested arrays or objects
                value = value.map((it) => {
                    if (Array.isArray(it))
                        throw new Error('JQL: Nested arrays not supported . Consider using a nativeFunction for that query instead.')

                    if (typeof it === 'string') {
                        //make string value safe

                        it = cleanString(it);
                    }

                    return it;
                })

                value = "(" + value.join(', ') + ")";
            }

            res += q + value;

        }

        res += queryChunks[queryChunks.length - 1];

        //console.log('query:', res);

        return res;
    } catch (err) {
        throw new Boom.badRequest('Bad JQL:', err)
    }
}

function jqlToJSON(queryChunks, ...injects) {
    const safeJql = jql(queryChunks, ...injects);
    return parser.parse(safeJql);

}

module.exports = {
    jqlParser: parser,
    compile: jollofql.compile,
    jql,
    jqlToJSON
}