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
        password: { type: String, meta: { widget: 'password' } },
        isAdmin: Boolean,
        accountType: {
            type: String, meta: {
                choices: [
                    'normal',
                    'grand',
                    'epic'
                ]
            }
        }

    },
    hooks: {
        preSave: async function () {

            //refresh name
            this.name = this.firstName + ' ' + this.lastName;

            //password
            let origUser;
            if (this.isPersisted()) {
                origUser = await jollof.models.User.findById(this.id);
            }

            if (!origUser || origUser.password != this.password) {
                this.password = await jollof.crypto.hash(this.password);
            }
            return;
        }
    },
    /**
     * Methods are convenience functions that are statically attached to a Model. e.g User.findNear(...)
     */
    methods: { //
        * findNear(long1, lat1, long2, lat2){
            console.log('FOO METHOD: finding a Foo near', ...arguments);
        }
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
                console.log('MongoDB: Finished Setting up Foo ');

                await this.db.collection('User').createIndex({ email: 1 });
            },

            async pityFoo(param){
                console.log('mongo pity!', this._adapterName, params.foo)
            },

            async slapFoo(){
                console.log('mongo slap', this._adapterName)
            }
        }

    }

}


module.exports = data.registerModel(schema);