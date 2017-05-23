/**
 * Created by iyobo on 2017-05-21.
 */
var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        //this.option('babel'); // This method adds support for a `--babel` flag
    }

    prompting() {
        return this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.appname // Default to current folder name
            },
            //{
            //    type: 'confirm',
            //    name: 'cool',
            //    message: 'Would you like to enable the Cool feature?'
            //},
            {
                type: 'input',
                name: 'description',
                message: 'Your project description?',
                default: 'A JollofJS app'
            }
        ]).then((answers) => {
            this.log('App name', answers.name);
            this.log('Description', answers.description);
        });
    }


    moveFiles() {
        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('public/index.html'),
            { title: 'Templating with Yeoman' }
        );
    }

};