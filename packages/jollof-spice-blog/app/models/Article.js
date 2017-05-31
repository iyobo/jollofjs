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
    name: 'Article',
    structure: {
        title: String,
        subTitle: String,
        author: { type: String, meta: { widget: 'ref', ref: 'User' } },
        isPublished: Boolean,
        publishedAt: Date,
        body: { type: String, meta: { widget: 'richtext' } },
        tags: [String],
        category: { type: String, meta: { widget: 'ref', ref: 'Category' } },
        domain: String,
    },

    /**
     * Natives are functions that you can use to access the full power of whatever native type this model's active connector belongs to. i.e. User.native.pityFoo({foo: 'bar'}).
     *
     * The init native function of a model will always be ran automatically after the model's adapter finishes initialization.
     * This is generally where you want to set indexes.
     */
    native: {
        mongodb: {
            async init(){

                await this.db.collection('Article').createIndex({ title: 1 }, { unique: true });
            }
        }

    }

}


module.exports = data.registerModel(schema);