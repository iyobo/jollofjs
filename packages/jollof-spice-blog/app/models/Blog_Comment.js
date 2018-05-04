/**
 * Created by Iyobo Eki on 2018-01-20.
 */

module.exports = (jollof) => {

    const data = jollof.data;
    const types = data.types;
    const _ = require('lodash');
    const gravatar = require('gravatar-url');

    const modelName = 'Blog_Comment';

    const schema = {
        name: modelName,
        dataSource: 'default',
        structure: {

            nickname: String,
            email: types.Email(),
            body: { type: String, meta: { widget: 'textarea' } },
            parentComment: types.Ref({ meta: { ref: 'Comment' } }),
            article: types.Ref({ meta: { ref: 'Article' } }),
            image: types.File(),

            createdBy: types.Ref({ allowNull: true, meta: { ref: 'User' } }),

        },

        hooks: {
            async preSave() {

                //set image
                //first attempt use of user image
                if (!this.image || this.image === {}) {
                    if (this.createdBy) {
                        const user = await jollof.models.User.findById(this.createdBy);
                        this.image = user.image;
                    } else {
                        this.image = {
                            name: 'gravatar',
                            type: 'image',
                            engine: 'url',
                            url: gravatar(this.email, { size: 200 })
                        }
                    }
                }

            },
            async postCreate() {
                //after creating a comment, update the article model count
                const article = await jollof.models.Article.findById(this.article)
                article.commentCount++;
                await article.save()
            }
        },

        native: {
            mongodb: {
                async init() {
                    await this.db.collection(modelName).ensureIndex({ article: 1, dateCreated: 1 });
                    await this.db.collection(modelName).ensureIndex({ email: 1 });
                    await this.db.collection(modelName).ensureIndex({ parentComment: 1 });
                },

                /**
                 * gets a graph of comments.
                 *
                 * @param articleId
                 * @returns {Promise<void>}
                 */
                async getCommentTree(articleId) {
                    //OMG: MongoDB sucks so bad! it's graphing things up the wrong way. I guess it's not going to help me build this tree
                    //const tree = await this.db.collection('Comment').aggregate([
                    //    {
                    //        $match: {
                    //            article: jollof.models.Article.wrapId(articleId),
                    //            $or: [{ parentComment: { $exists: false } }, { parentComment: null }]
                    //        }
                    //    },
                    //    { $sort: { dateCreated: -1 } },
                    //    {
                    //        $graphLookup: {
                    //            from: 'Comment',
                    //            startWith: '$parentComment',
                    //            connectFromField: 'parentComment',
                    //            connectToField: '_id',
                    //            as: 'children'
                    //        }
                    //    }
                    //
                    //]).toArray();

                    const Comment = jollof.models.Comment;
                    const Article = jollof.models.Article;

                    const comments = await Comment.findBy({ article: Article.wrapId(articleId) });

                    //Build comment tree manually
                    const roots = [];
                    const commentMap = {};

                    //build indexes, create child arrays and identify roots
                    comments.forEach((comment) => {
                        const it = comment.toJSON();
                        it.children = [];
                        commentMap[it.id] = it;

                        if (!it.parentComment) roots.push(it);
                    })

                    //attach children to parents
                    _.each(commentMap, (it) => {
                        const parent = commentMap[it.parentComment];
                        if (parent) {
                            parent.children.push(it)
                        }
                    })

                    return roots;
                }
            },
            arangodb: {
                async init() {

                    await this.db.collection(modelName).createSkipList(['article', 'dateCreated']);
                    await this.db.collection(modelName).createSkipList(['email']);
                    await this.db.collection(modelName).createSkipList(['parentComment']);
                },

                /**
                 * gets a graph of comments.
                 *
                 * @param articleId
                 * @returns {Promise<void>}
                 */
                async getCommentTree(articleId) {
                    //TODO: use ArangoDB native graphing to achieve this

                    const Comment = jollof.models.Comment;
                    const Article = jollof.models.Article;

                    const comments = await Comment.findBy({ article: Article.wrapId(articleId) });

                    //Build comment tree manually
                    const roots = [];
                    const commentMap = {};

                    //build indexes, create child arrays and identify roots
                    comments.forEach((comment) => {
                        const it = comment.toJSON();
                        it.children = [];
                        commentMap[it.id] = it;

                        if (!it.parentComment) roots.push(it);
                    })

                    //attach children to parents
                    _.each(commentMap, (it) => {
                        const parent = commentMap[it.parentComment];
                        if (parent) {
                            parent.children.push(it)
                        }
                    })

                    return roots;
                }
            }

        }
    };


    data.registerModel(schema);
};