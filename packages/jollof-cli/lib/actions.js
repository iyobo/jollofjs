/**
 * Created by iyobo on 2017-05-21.
 */
var chalk = require('chalk');
var path = require('path');
const editJsonFile = require("edit-json-file");
const childProc = require('child_process');
var ghdownload = require('github-download')
var os = require('os');
var ncp = require('ncp').ncp;
ncp.limit = 16;

/**
 * Run a command in a project
 * @param args
 * @param args._ - array of unkeyed values
 * @returns {Promise.<void>}
 */
exports.run = async function (args) {

    if (args._.length <= 0) {
        throw new Error('No run command specified i.e jollof run <command>')
    }

    const currentLocation = process.cwd();
    const command = args._[0];

    console.log(`Preparing to run command "${command}" at "${currentLocation}"...\n`);
    args._ = args._.slice(1);

    require(path.join(currentLocation, 'commands', command))(args);
}

/**
 * Create/Scaffold new project
 * @param args
 * @param args._[0] - projectName
 * @returns {Promise.<void>}
 */
exports.new = async function (args) {

    if (args._.length <= 0) {
        throw new Error('No projectName specified i.e jollof new <projectName>')
    }

    const currentLocation = process.cwd();
    const projectName = args._[0];
    const mvpUrlScaffold = 'https://github.com/iyobo/jollof-app-mvp';
    const projectLocation = path.join(currentLocation, projectName);

    console.log('Downloading recipe: ' + mvpUrlScaffold + '...');

    // First download the github
    await new Promise((resolve, reject) => {
        ghdownload(mvpUrlScaffold, projectLocation)
            .on('error', function (err) {
                reject(err);
            })
            .on('end', function (dir) {
                console.log(chalk.yellow('Cooking...'));
                resolve(dir)
            })
    });


    console.log(chalk.green("Bon apetit!\n"));
    console.log(chalk.yellow("To run:"));
    console.log(chalk.green(`- cd '${projectLocation}'`));
    console.log(chalk.green(`- npm i `));
    console.log(chalk.green(`- npm run`));

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