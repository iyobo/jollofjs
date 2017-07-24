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
        foos: [types.Ref({ meta: { ref: 'Foo' } })],
        body: { type: String, meta: { widget: 'richtext' } },

        sections: [
            {
                title: String,
                body: { type: String, meta: { widget: 'richtext' } }
            }
        ]

    }
}

module.exports = data.registerModel(schema);