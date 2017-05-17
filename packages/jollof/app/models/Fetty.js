/**
 * Created by iyobo on 2016-09-18.
 */
var data = require('../../lib/data/index.js');
var types = data.types;


//Models use names
const schema = {
    name: 'Fetty',
    structure: {
        name: { type: String, required: true },
        foo: types.Ref({ meta: { ref: 'Foo' } }),
        foos: [types.Ref({ meta: { ref: 'Foo' } })]

    }
}

module.exports = data.registerModel(schema);