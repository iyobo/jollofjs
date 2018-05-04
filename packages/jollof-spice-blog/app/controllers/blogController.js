const jollof = require('jollof');
const boom = require('boom')
const populateArticles = require('../services/blogService').populateArticles;


exports.categoryAll = async (ctx) => {
    await populateArticles(ctx);
    await ctx.render('blog/blog');
}

exports.categorySoftware = async (ctx) => {
    await populateArticles(ctx, 'Software');
    await ctx.render('blog/blog');
}

exports.categoryArt = async (ctx) => {
    await populateArticles(ctx, 'Art');
    await ctx.render('blog/blog');
}

exports.categoryLife = async (ctx) => {
    await populateArticles(ctx, 'Life');
    await ctx.render('blog/blog');
}


exports.articleBySlug = async (ctx) => {
    const slug = ctx.params.slug;
    const article = await jollof.models.Blog_Article.findOneBy({ slug });

    if (!article)
        throw new boom.notFound('Article not found');

    ctx.state.article = article;
    await ctx.render('blog/article');
};

exports.articleById = async (ctx) => {

    const id = ctx.params.id;
    const article = await jollof.models.Blog_Article.findById(id);
    if (!article)
        throw new boom.notFound('Article not found');

    ctx.state.article = article;
    await ctx.render('blog/article');
};

/**
 * Returns comment tree of an article
 * @param ctx
 * @returns {Promise<void>}
 */
exports.commentsOfArticle = async (ctx) => {

    const id = ctx.params.id;
    const Article = jollof.models.Blog_Article;
    const article = await Article.findById(id);
    if (!article)
        throw new boom.notFound('Article not found');

    const Comment = jollof.models.Blog_Comment;
    //const comments = await jollof.models.Comment.findBy({ article: article.id }, { sort: { dateCreated: -1 } });

    const res = await Promise.all([
        Comment.native.getCommentTree(id),
        Comment.countBy({ article: Article.wrapId(id) })
    ]);

    ctx.body = { commentCount: res[1], comments: res[0] };
};

/**
 * create a comment.
 * @param ctx.params = {id} for article id
 * @param ctx.fields = {nickname?, email?,body, parentCommit
 * @returns {Promise<void>}
 */
exports.createComment = async (ctx) => {


    const slug = ctx.params.slug;
    const article = await jollof.models.Blog_Article.findOneBy({ slug });
    if (!article)
        throw new boom.notFound('Article not found');

    const Comment = jollof.models.Blog_Comment;

    const fields = ctx.request.fields;
    const user = ctx.session.user;

    const newComment = new Comment({
        body: fields.body,
        article: article.id,
        parentComment: fields.parentComment
    });

    if (user) {
        newComment.createdBy = user.id;
        newComment.nickname = fields.nickname || user.nickname || user.name;
        newComment.email = user.email
    } else {
        newComment.createdBy = null;
        newComment.nickname = fields.nickname
        newComment.email = fields.email
    }


    await newComment.save();

    article.commentCount++;
    await article.save()


    ctx.redirect('/blog/' + slug)
};

