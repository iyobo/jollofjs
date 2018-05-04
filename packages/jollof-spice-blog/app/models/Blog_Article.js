/**
 * Created by Iyobo Eki on 2018-01-20.
 */

module.exports = (jollof) => {


    const data = jollof.data;
    const types = data.types;
    const slugify = require('slug');

    const modelName = 'Blog_Article';
    const schema = {
        name: modelName,
        dataSource: 'default',
        structure: {
            title: { type: String, required: true },
            slug: String,
            category: {
                type: String, default: 'Software', meta: {
                    choices: [
                        'Software',
                        'Life',
                        'Art',
                        'Games'
                    ]
                }
            },
            description: String,
            body: { type: String, meta: { widget: 'richtext' } },
            tags: [String],
            published: Boolean,
            datePublished: Date,
            featured: { type: Boolean, default: true },
            createdBy: types.Ref({ meta: { ref: 'User' } }),
            featuredImage: types.File(),

            authorName: String,
            authorEmail: String,
            authorImage: types.File(),
            commentCount: { type: Number, default: 0 }

        },

        hooks: {

            async preSave() {

                //Create friendlyId
                if (!this.slug || this.slug === '') {
                    let slug = slugify(this.title).toLowerCase();

                    //remove last slash if last character
                    if (slug.length > 20) slug = slug.substring(0, 20);

                    if (slug.endsWith('-')) {
                        slug = slug.substring(0 - 19)
                    }

                    //handle dups
                    const existing = await jollof.models.Article.find([
                        ['slug', '=', slug],
                        ['id', '!=', this.id || null]
                    ]);

                    existing.forEach((it) => {
                        slug += 'i'
                    })
                    this.slug = slug;
                }

                //always update description if there is a need to

                if (!this.description || this.description === '')
                    this.description = this.body.replace(/<(.|\n)*?>/g, '').substring(0, 100) + '...';


                //cache author after saving
                if (this.createdBy) {
                    const author = await jollof.models.User.findById(this.createdBy);
                    this.authorName = author.name;
                    this.authorEmail = author.email;
                    this.authorImage = author.image;
                    await this._save();
                }


            }
        },

        native: {
            mongodb: {
                async init() {
                    await this.db.collection(modelName).ensureIndex({ slug: 1 }, { unique: true });
                    await this.db.collection(modelName).ensureIndex({ category: 1 });
                    await this.db.collection(modelName).ensureIndex({ published: 1 });
                }
            },
            arangodb: {
                async init() {
                    await this.db.collection(modelName).createSkipList(['slug'], { unique: true });
                    await this.db.collection(modelName).createSkipList(['category']);
                    await this.db.collection(modelName).createSkipList(['published']);
                }
            }
        }
    };

    data.registerModel(schema);
};

