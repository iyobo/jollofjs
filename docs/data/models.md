# Models

Models are how you tell JollofJS how to structure your data.

All models for your app MUST be placed under apps/models

Let's look at the User model in there

```
const jollof = require('jollof');
const data = jollof.data;
const types = data.types;
const jql = data.jql;


const schema = {
    name: 'User',
    dataSource: 'default',
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

    ...

}


module.exports = data.registerModel(schema);
```

If you have worked with ODMs like Mongoose, this should look familiar.

## Static Methods
To extend this model statically, define schema.statics. ex:

```
schema.statics = {
    async countAllUsersWithFirstName(firstName){

        //you have access to all models here via
        //jollof.models.AnyModel
        return await jollof.models.User.countBy({firstName});

    }
}
```

then you can call those from anywhere using `await jollof.models.User.countAllUsers()`.

## Instance methods

To extend a model instance, define schema.methods. ex:
```
schema.methods = {
    async printFullName(){

        //Again, you have access to all models here too via
        //jollof.models.AnyModel

        return this.firstName + ' '+this.lastName;
    }
}
```
Notice how `this` gives you access to the actual instance of the model instance you are extending.

You can call a model instance method from a model. i.e
```
const user = jollof.models.User.findOneBy({email: 'foo@bar.com'})
...
//assuming user is not null

const fullName = user.printFullName()

console.log(fullName)

```

## Native methods

It is not Jollof Data's goal to claim to be everything you need to access your data layer.
No data abstraction layer can promise that. What it DOES do beautifully well, is get out of the way so you can do access your data yourself.
It does so by extending the data adapter for your model through Native methods.

Native methods are where Jollof Data supercedes all current known data abstraction paradigms.

```
schema.native = {
    mongodb: {
        async init() {

            await this.db.collection('User').createIndex({ email: 1 }, { unique: true });
        },
    }
}

```

In fact, JollofJS actively encourages you to define native functions right from the start because the init() native function is the only place you can define indexes on your model.

When booting, Jollof Data will run the init function for any active native groups.
Here, I'll explain:
```
In the startup project,
Because the User model uses the 'default' dataSource,
which is grouped under the nativeType named 'mongodb' (as seen in config/base.js under datasources),
Then that means the nativeType named 'mongodb' is the active nativeType.
This means that when the app is started, mongodb.init() will be run automatically by Jollof.

```

You can define and run other native functions besides init() (eg: generateGraph) and call it via jollof.models.User.native.generateGraph().
Notice how you do not specify the nativeType when calling a native function. JollofJS will figure that out for you depending on what is active.