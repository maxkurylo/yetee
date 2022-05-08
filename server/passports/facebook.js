const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const APP_URL = process.env.APP_URL;


module.exports = function(passport) {
    const opts = {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: `${APP_URL}/api/auth/facebook/callback`
    };
    passport.use(FacebookStrategy(opts,
        async (accessToken, refreshToken, profile, done) => {
            console.dir(profile);
            // User.findOne({facebook_id: profile.id}, function(err, user) {
            //     if (err) {
            //         return done(err, false);
            //     }
            //     if (user) {
            //         return done(null, user);
            //     } else {
            //         return done(null, false);
            //         // or you could create a new account
            //     }
            // });
            try {
                const user = await User.findOrCreate({ facebook_id: profile.id }, {
                    facebook_id: profile.id,
                    name: profile.displayName,
                    provider: 'facebook'
                });
                return done(null, user.toJSON())
            } catch (err) {
                return done(err)
            }
        }));
};