/**
 * Created by iyobo on 2017-05-21.
 */
var chalk = require('chalk');

exports.run = async function (args) {

    console.log(args);
}

exports.new = async function (args) {

    console.log('Creating new project with', args);
}

exports.help = async function (args) {

    console.log(`
Command Line Interface for running Jollof actions.    
`);

    console.log(chalk.green('jollof run <commandName> [...params]'));
    console.log('  Runs a command in a JollofJS app. \n ');

    console.log(chalk.green('jollof new <projectName> [...params]'));
    console.log('  Creates a new JollofJS app.\n ');

    console.log(chalk.green('jollof help'));
    console.log('  This Display.\n ');

    console.log('\n(c) 2017 - Iyobo Eki\n')
}