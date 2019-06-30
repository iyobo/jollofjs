const figlet = require('figlet')
console.log(figlet.textSync('JollofJS'));

const jollof = require('jollof');


jollof.bootstrap.bootServer(function*(app) {
    jollof.log.info('Server started');
});