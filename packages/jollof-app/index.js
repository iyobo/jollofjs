const figlet = require('figlet')
console.log(figlet.textSync('JollofJS'));

const jollof = require('jollof');


//return (async ()=>{
//    console.log('Wait what?')
//})()

jollof.bootstrap.bootServer(function*(app) {

    //jollof.log.info('Mounting a jollof-plugin');


    jollof.log.info('Server started');
});