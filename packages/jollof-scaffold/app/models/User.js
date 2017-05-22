/**
 * Created by iyobo on 2017-01-10.
 */
/**
 * Created by iyobo on 2016-09-18.
 */
const jollof = require('jollof');
const data = jollof.data;
const types = data.types;

//Models use names
const schema = {
    name: 'User',
    connectionName: 'default',
    structure: {
        firstName: String,
        lastName: String,
        name: { type: String, meta: { disableEdit: true } },
        email: types.Email(),
        password: {type: String, meta:{ widget:'password' }},
        isAdmin: Boolean

    },
    hooks: {
        preSave: async function () {

            //refresh name
            this.name = this.firstName + ' ' + this.lastName;

            //password
            const origUser = await jollof.models.User.findById(this.id);
            if (!origUser || origUser.password != this.password) {
                this.password = await jollof.crypto.hash(this.password);
            }
        }
    },
    /**
     * Methods are convenience functions that are statically attached to a Model. e.g Foo.findNear(...)
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
            async init(){
                console.log('Memory: Finished Setting up Foo ');
            },

            async pityFoo(fooName){
                console.log(`memory: pity! ${fooName} context: ${this.db}`);
            },

            async slapFoo(){
                console.log('memory slap', this.db)
            }
        },
        mongodb: {
            async init(){
                console.log('MongoDB: Finished Setting up Foo ');
            },

            async pityFoo(param){
                console.log('mongo pity!', this._adapterName)
            },

            async slapFoo(){
                console.log('mongo slap', this._adapterName)
            }
        }

    }

}


module.exports = data.registerModel(schema);