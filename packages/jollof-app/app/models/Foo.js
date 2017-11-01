/**
 * Created by iyobo on 2017-01-10.
 */
/**
 * Created by iyobo on 2016-09-18.
 */
const jollof = require('jollof');
const data = jollof.data;
const types = data.types;
const jql = data.jql;

//Models use names
const schema = {
    name: 'Foo',
    dataSource: 'default',
    description: 'Delete this model anytime',
    structure: {
        user: types.Ref({ meta: { ref: 'user' } }),
        mappings: {
            byUser: types.Ref({ meta: { ref: 'user' } }),
            mappedOn: Date
        },
        userListings: [
            types.Ref({ meta: { ref: 'user' } })
        ],
        userMappingListings: [
            {
                mappedUser: types.Ref({ meta: { ref: 'user' } }),
                happenedOn: Date
            }
        ]

    }

}


module.exports = data.registerModel(schema);