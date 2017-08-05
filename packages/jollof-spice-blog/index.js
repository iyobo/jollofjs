const path = require('path');
const requireDir = require('require-dir');

module.exports = async function (jollof) {

    jollof.log.info('Adding Blog Spice');

    //Run models
    requireDir(path.join(__dirname, 'app', 'models'), { recurse: true });

    //Add to jollof
    jollof.spices.push({
        name: 'Blog',
        statics: {
            rootDir: path.join('node_modules', 'jollof-spice-blog', 'static'),
            rootPath: '/blogstatic',
        },
        views: {
            path: path.join('node_modules', 'jollof-spice-blog', 'app', 'views')
        },
        routes: require('./app/routes/default')

    });

};
