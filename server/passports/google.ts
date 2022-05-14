import User, { IUserDocument } from '../models/user';
import { OAuth2Strategy, IOAuth2StrategyOption, Profile } from 'passport-google-oauth';
import { VerifiedCallback } from 'passport-jwt';
import { PassportStatic } from 'passport';
import { generateUser}  from '../user-registration';

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.

const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET || '';
const APP_URL: string = process.env.APP_URL || '';

const opts: IOAuth2StrategyOption = {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${APP_URL}/api/auth/google/callback`
};

export default function(passport: PassportStatic) {
    passport.use(new OAuth2Strategy(opts, (accessToken: string, refreshToken: string, profile: Profile, done: VerifiedCallback) => {
        User.findOne({ google_id: profile.id })
            .exec()
            .then(user => {
                if (user) {
                    return done(null, user)
                }
                addGoogleUser(profile)
                    .then(createdUser => done(null, createdUser))
                    .catch(err => done(err, null));
            })
            .catch(err => done(err, null));
    }));
};


function addGoogleUser(profile: Profile): Promise<IUserDocument | null> {
    const newUser = generateUser({
        name: profile.displayName,
        avatarUrl: profile._json.picture,
        google_id: profile.id
    });

    return User.addUser(newUser);
}