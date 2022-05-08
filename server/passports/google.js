const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require("../models/user");
const generateUser = require('../user-registration');

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const APP_URL = process.env.APP_URL;

module.exports = function(passport) {
    const opts = {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${APP_URL}/api/auth/google/callback`
    };
    passport.use(new GoogleStrategy(opts, function(accessToken, refreshToken, profile, done) {
        User.findOne({ google_id: profile.id }, function (err, user) {
            if (err) return done(err, false);

            if (user) {
                done(null, user);
            } else {
                const newUser = generateUser({
                    name: profile.displayName,
                    avatarUrl: profile._json.picture,
                    google_id: profile.id
                });

                User.addUser(newUser, (err, user) => {
                    if (err) return done(err, false);
                    done(null, user);
                });
            }
        });
    }));
};

