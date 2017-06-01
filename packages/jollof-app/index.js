const figlet = require('figlet')
console.log(figlet.textSync('JollofJS'));

const jollof = require('jollof');

const blogSpice = require('jollof-spice-blog');

(async ()=>{

    await blogSpice(jollof);

    jollof.bootstrap.bootServer(function*(app) {

        jollof.log.info('Server started');
    });
})();
