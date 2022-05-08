const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require("../models/user");
const generateUser = require('../user-registration');

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const APP_URL = process.env.APP_URL;

module.exports = function(passport) {
    const opts = {
        clientID: LINKEDIN_CLIENT_ID,
        clientSecret: LINKEDIN_CLIENT_SECRET,
        callbackURL: `${APP_URL}/api/auth/linkedin/callback`,
        scope: ['r_emailaddress', 'r_liteprofile'],
    };
    passport.use(new LinkedInStrategy(opts, function(accessToken, refreshToken, profile, done) {
        User.findOne({ linkedin_id: profile.id }, function (err, user) {
            if (err) return done(err, false);
            if (user) {
                done(null, user);
            } else {
                // done(null, false);
                let photo;
                if (profile.photos) { // if there any photos in profile
                    photo = profile.photos[profile.photos.length - 1]; // select one with the largest resolution
                    if (photo) {
                        photo = photo.value;
                    }
                }
                const newUser = generateUser({
                    name: profile.displayName,
                    avatarUrl: photo,
                    linkedin_id: profile.id,
                    email: profile.emails[0].value
                });

                User.addUser(newUser, (err, user) => {
                    if (err) return done(err, false);
                    done(null, user);
                });
            }
        });
    }));
};

