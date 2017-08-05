/**
 * Created by iyobo on 2017-01-10.
 */
/**
 * Created by iyobo on 2016-09-18.
 */
const jollof = require('jollof');
const data = jollof.data;
const types = data.types;

//Media files
const schema = {
    name: 'Blog_Media',
    structure: {
        name: { type: String, meta: { disableEdit: true } },
        file: types.File(),
        isImage: Boolean,
        isVideo: Boolean,
        domain: String
    },
    hooks: {
        preSave: async function () {

            //Refresh name
            this.name = this.file ? this.file.name : null;

        }
    }

}


module.exports = data.registerModel(schema);