/**
 * Created by iyobo on 2017-05-21.
 */
var chalk = require('chalk');
var path = require('path');

/**
 * Run a command in a project
 * @param args
 * @returns {Promise.<void>}
 */
exports.run = async function (args) {

    if(args._.length <= 0){
        throw new Error('No run command specified i.e jollof run <command>')
    }

    const root = process.cwd();
    const command = args._[0];

    console.log(`Preparing to run command "${command}" at "${root}"...\n`);
    args._ = args._.slice(1);

    require(path.join(root,'commands', command ))(args);
}

/**
 * Create/Scaffold new project
 * @param args
 * @returns {Promise.<void>}
 */
exports.new = async function (args) {

    console.log('Coming soon...', args);

}


/**
 * Show help
 * @param args
 * @returns {Promise.<void>}
 */
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