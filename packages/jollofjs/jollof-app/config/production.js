/**
 * Created by iyobo on 2016-11-07.
 */

module.exports = {

    env: 'production',

    server: {
        port: 3003
    },
    nunjucks: {
        nunjucksConfig: {
            //see https://mozilla.github.io/nunjucks/api.html#configure
            noCache: false,

        },
    }

}

