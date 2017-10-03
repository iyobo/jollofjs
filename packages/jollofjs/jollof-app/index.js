require('moment').locale();
const jollof = require('jollof');
const passport = require('koa-passport');
const convert = require('koa-convert');


(async () => {

    /**
     * A spice is a secondary jollofJS app mounted on your current
     */
    //await require('jollof-spice-blog')(jollof);


    await jollof.bootstrap.bootServer(function* (app) {

        //add overrides / things to add to koa app before it gets launched

        /**
         * From this point, you are working with KoaJS.
         * Add overrides to the koa instance jollofJS will run on.
         * You could implement any plugin supported by Koa here.
         */

        app.proxy = true;

        /**
         * This scaffold app wires together a quick koa-passport implementation for you.
         * However, JollofJS is not dependent on any of these and you can rip it out and use whatever
         * authentication/authorization wiring you need for your app.
         */

        app.use(passport.initialize());
        app.use(passport.session());
        app.use(convert(function* (next) {
            this.passport = passport;
            return yield next;
        }));

        //Setup passport auth strategies
        require('./app/services/passport/strategies').setupStrategies(app, passport);
    });

    console.log(require('figlet').textSync('JollofJS'));
    console.log('><><><><><><><><><><><><><><><><><><><');

})();
