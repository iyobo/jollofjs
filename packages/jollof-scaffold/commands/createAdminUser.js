/**
 * Created by iyobo on 2017-05-21.
 */
const jollof = require('jollof');

jollof.bootstrap.boot(async function(){

    const adminUser = new jollof.models.User({
        firstName: 'Admin',
        lastName: 'Boss',
        email: 'phil.eki@gmail.com',
        password: 'password'
    });

    await adminUser.save();

    jollof.log('Admin user created:', adminUser.email);
});