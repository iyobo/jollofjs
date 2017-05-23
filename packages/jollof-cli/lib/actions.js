/**
 * Created by iyobo on 2017-05-21.
 */
var chalk = require('chalk');
var path = require('path');
const editJsonFile = require("edit-json-file");
const childProc = require('child_process');
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

    let scaffoldSource = path.join(__dirname, '..', 'scaffold');
    let destination = path.join(currentLocation, projectName);

    console.log('Cooking Project: ' + projectName + '...');

    //move scaffold files
    console.log(chalk.yellow('Moving pots...'));
    await new Promise((resolve, reject) => {
        ncp(scaffoldSource, destination, function (err) {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });

    //exchange package.json
    console.log(chalk.yellow('Setting table...'));
    let file = editJsonFile(path.join(destination, 'package.json'));
    file.set('name', projectName);
    file.save();

    //Now run 'npm i'
    console.log(chalk.yellow('Serving Jollof...'));
    await new Promise((resolve, reject) => {
        childProc.exec(`cd ${destination} && npm i`, (error, stdout, stderr) => {
            if (error) {
                console.log('ERROR',error);
                if (error.code === 0)
                    return resolve();
                else
                    return reject(error);
            }
            //console.log(`stdout: ${stdout}`);
            ////console.log(`stderr: ${stderr}`);
            return resolve();
        });
    });


    console.log(chalk.green("Bon apetit!"));
    console.log(chalk.green(`Go to '${destination}' and run 'npm start'`));

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