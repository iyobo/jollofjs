const figlet = require('figlet')
console.log(figlet.textSync('JollofJS'));

const jollof = require('jollof');

(async ()=>{

    //Add spices
    await require('jollof-spice-blog')(jollof);


    await jollof.bootstrap.bootServer(function*(app) {

        //add overrides / things to add to koa app before it get launched
    });

    console.log('><><><><><><><><><><><><><><><><><><><');

})();
