const jollof = require('jollof');
const User = jollof.models.User;
const crypto = jollof.crypto;

/**
 * This function is called from internal jollof. It sets up the app with Authentication strategies.
 * Jollof comes with Passport, though you could effectually ignore passport and end up using whatever you want.
 *
 * Passport is an express plugin with over 300 different authentication strategies! It might look unwieldy due to
 * the fact that it was built with legacy ES5 in mine, but it's well worth it to understand it and build apps with
 * unlimited connectivity!
 *
 * Users today expect to login to your app with Google, Facebook, Twitter, etc and will easily move on if
 * you do not provide the options to.
 *
 * @param passport - the passport instance
 */
exports.setupStrategies = (app, passport) => {
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(async function (id, done) {
        try {
            const user = await User.findById(id);
            done(null, user)
        } catch (err) {
            done(err)
        }
    })

    /**
     * The Passport Local Strategy covers checking username and password against a datasource.
     */
    const LocalStrategy = require('passport-local').Strategy
    passport.use(new LocalStrategy( function (username, password, done) {

        // This user object only uses Email.
        try {
            const user =  User.findOneBy({ email: username });

            if (user &&  crypto.compare(password, user.password)) {
                return done(null, user)

            } else {
                return done(null, false)
            }
        } catch (err) {
            return done(err)
        }

    }))


    /**
     * Here are some other strategies you can activate.
     */
    //const FacebookStrategy = require('passport-facebook').Strategy
    //passport.use(new FacebookStrategy({
    //        clientID: 'your-client-id',
    //        clientSecret: 'your-secret',
    //        callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback'
    //    },
    //    function(token, tokenSecret, profile, done) {
    //        // retrieve user ...
    //        fetchUser().then(user => done(null, user))
    //    }
    //))
    //
    //const TwitterStrategy = require('passport-twitter').Strategy
    //passport.use(new TwitterStrategy({
    //        consumerKey: 'your-consumer-key',
    //        consumerSecret: 'your-secret',
    //        callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/twitter/callback'
    //    },
    //    function(token, tokenSecret, profile, done) {
    //        // retrieve user ...
    //        fetchUser().then(user => done(null, user))
    //    }
    //))
    //
    //const GoogleStrategy = require('passport-google-auth').Strategy
    //passport.use(new GoogleStrategy({
    //        clientId: 'your-client-id',
    //        clientSecret: 'your-secret',
    //        callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback'
    //    },
    //    function(token, tokenSecret, profile, done) {
    //        // retrieve user ...
    //        fetchUser().then(user => done(null, user))
    //    }
    //))

}