#!/usr/bin/env node
var chalk = require('chalk');
var figlet = require('figlet');

var actions = require('../lib/actions.js');

var action = process.argv[2];
var argv = require('minimist')(process.argv.slice(3));


(async () => {
    console.log(figlet.textSync('JollofJS'));

    if (!actions[action]) {
        action = 'help';
    }
    console.log(chalk.blue.bold(action.toUpperCase()),'\n');

    //Run action from a map of available actions
    await actions[action](argv);

    console.log('')
})().catch(err => {
    console.log(chalk.red(err.message),'\n');
});
