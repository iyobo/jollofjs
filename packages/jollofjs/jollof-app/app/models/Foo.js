/**
 * Created by iyobo on 2017-01-10.
 */
/**
 * Created by iyobo on 2016-09-18.
 */
var data = require('jollof').data;
const types = data.types;

//Models use names
const schema = {
    name: 'Foo',
    dataSource: 'default',
    structure: {
        name: String,
        age: Number,

        mig: types.Ref({ meta: { ref: 'JollofMigration', condition: '' } }),

        mugshot: types.File(),
        //richy: types.RichText(),
        any: {
            aString: String,
            aNumber: Number,
            aDate: Date
        },
        //crono: Date,
        logic: { type: Boolean, meta: { description: 'Do you like logic?' } },
        //body: types.Textarea(),
        //home: types.Location(),
        //sightings: [types.Location()],
        //email: types.Email(),
        strings: [String],


        //gallery: [types.File()]
    },
    indexes: {},
    /**
     * Methods are convenience functions that are statically attached to a Model.
     */
    methods: { //
        * findNear(long1, lat1, long2, lat2){
            console.log('FOO METHOD: finding a Foo near', ...arguments);
        }
    },
    /**
     * Natives are functions that you can use to access the full power of whatever native type this model's active connector belongs to.
     */
    native: {
        memory: {
            * init(){
                console.log('Memory: Finished Setting up Foo ');
            },

            * pityFoo(fooName){
                console.log(`memory: pity! ${fooName} context: ${this.db}`);
            },

            * slapFoo(){
                console.log('memory slap', this.db)
            }
        },
        mongodb: {
            * init(){
                console.log('MongoDB: Finished Setting up Foo ');
            },

            * pityFoo(coll){
                console.log('mongo pity!', this._adapterName)
            },

            * slapFoo(){
                console.log('mongo slap', this._adapterName)
            }
        }

    }

}


module.exports = data.registerModel(schema);