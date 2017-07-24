/**
 * Created by iyobo on 2016-09-18.
 */
var data = require('jollof').data;
var types = data.types;


//Models use names
const schema = {
    name: 'Fetty',
    structure: {
        name: { type: String, required: true },
        foo: types.Ref({ meta: { ref: 'Foo' } }),
        foos: [types.Ref({ meta: { ref: 'Foo' } })],

        body: { type: String, meta: { widget: 'richtext' } },
        //sections: [
        //    {
        //        title: String,
        //        body: { type: String, meta: { widget: 'richtext' } }
        //    }
        //],

        bodies: [{ type: String, meta: { widget: 'richtext' } }],

        bodublock: {
            title: String,
            body: { type: String, meta: { widget: 'richtext' } },
            home: types.Location(),
            list: [String]
        }
    }
}

module.exports = data.registerModel(schema);