const path = require('path');

module.exports = async function (jollof) {

    jollof.log.info('Adding Blog Spice');

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

    })

};
