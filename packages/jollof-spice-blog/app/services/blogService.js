const jollof = require('jollof');

exports.populateArticles = async (ctx, category) => {

    const filter = { published: true };
    if (category) {
        filter.category = category;
        ctx.state.blogCategory = category;
    }

    ctx.state.blogArticles = await jollof.models.Blog_Article.findBy(filter, { sort: { datePublished: -1 } })
}