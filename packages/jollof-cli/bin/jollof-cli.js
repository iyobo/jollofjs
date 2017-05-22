#!/usr/bin/env node
var chalk = require('chalk');
var figlet = require('figlet');

var actions = require('../lib/actions.js');
var argv = require('minimist')(process.argv.slice(2));

var action = argv._[0];


(async () => {
    console.log(figlet.textSync('JollofJS'));

    if(!actions[action]){
        action = 'help';
    }
    console.log(chalk.blue.bold(action.toUpperCase()));

    //Run action from a map of available actions
    await actions[action](argv);
})().catch(err=>{
    console.error(err.message);
});
