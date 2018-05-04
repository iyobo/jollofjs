const blog = require('./controllers/blogController');


module.exports = {
    //'/': { flow: main.index},
    //'/about': { flow: main.about},
    //'/contact': { flow: main.contact},
    //'/article/:id': { flow: main.article},
    //'/category/:name': { flow: main.category},

    //blog
    'get /': { flow: blog.categoryAll },
    'get /software': { flow: blog.categorySoftware },
    'get /art': { flow: blog.categoryArt },
    'get /life': { flow: blog.categoryLife },

    //'post /article/:id': { flow: blog.createComment },,
    'get /article/:id': { flow: blog.articleById },

    'get /:slug': { flow: blog.articleBySlug },

    'post /:slug': { flow: blog.createComment }, //protect this with captcha. We want to mae it easy for folks to enter comments but still be quality

}