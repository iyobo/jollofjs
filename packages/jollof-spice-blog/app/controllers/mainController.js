const jollof = require('jollof');
const jql = jollof.jql;

exports.index = async (ctx) => {

    ctx.state.articles = await jollof.models.Blog_Article.find([], {raw:true});

    await ctx.render('blog/index');
}

exports.about = async (ctx) => {
    await ctx.render('blog/about');
}


exports.contact = async (ctx) => {
    await ctx.render('blog/contact');
}

exports.article = async (ctx) => {
    ctx.state.article = await jollof.models.Blog_Article.findById(ctx.params.id,{raw:true});
    ctx.state.author = await jollof.models.User.findById(ctx.state.article.author,{raw:true});
    await ctx.render('blog/article');
}
exports.category = async (ctx) => {
    const category = await jollof.models.Blog_Category.findById(ctx.params.id);

    ctx.state.articles = await jollof.models.Blog_Article.findBy({category: ctx.params.id});
    ctx.state.category = category;
    await ctx.render('blog/category');
}

exports.categories = async (ctx) => {
    await ctx.render('blog/category');
}

