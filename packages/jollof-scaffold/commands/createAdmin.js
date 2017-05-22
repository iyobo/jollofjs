/**
 * Created by iyobo on 2017-05-21.
 */
const jollof = require('jollof');


/**
 * Receives email and password
 * @param args
 * @param args._  - an array of un-keyed arguments
 * @param args._[0]  - email
 * @param args._[1]  - password
 */
module.exports = (args) => {

    if (args._.length < 2) {
        throw new Error('Must have 2 arguments for email and password. i.e jollof run createAdmin foo@bar.com foopass')
    }

    jollof.bootstrap.boot(async function () {

        //console.log(args._);

        const adminUser = await jollof.models.User.persist({
            firstName: 'Generated',
            lastName: 'Admin',
            email: args._[0],
            password: args._[1],
            isAdmin: true
        });

        console.log('Admin user created:', adminUser.email);
    });

}
