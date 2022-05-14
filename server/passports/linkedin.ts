import User, {IUserDocument} from '../models/user';
import {Strategy, StrategyOption, Profile} from 'passport-linkedin-oauth2';
import { VerifiedCallback } from 'passport-jwt';
import { PassportStatic } from 'passport';
import { generateUser}  from '../user-registration';

//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and LinkedIn
//   profile), and invoke a callback with a user object.

const LINKEDIN_CLIENT_ID: string = process.env.LINKEDIN_CLIENT_ID || '';
const LINKEDIN_CLIENT_SECRET: string = process.env.LINKEDIN_CLIENT_SECRET || '';
const APP_URL: string = process.env.APP_URL || '';


const opts: StrategyOption = {
    clientID: LINKEDIN_CLIENT_ID,
    clientSecret: LINKEDIN_CLIENT_SECRET,
    callbackURL: `${APP_URL}/api/auth/linkedin/callback`,
    scope: ['r_emailaddress', 'r_liteprofile'],
};


export default function(passport: PassportStatic) {
    passport.use(new Strategy(opts, (accessToken: string, refreshToken: string, profile: Profile, done: VerifiedCallback) => {
        User.findOne({ linkedin_id: profile.id })
            .exec()
            .then(user => {
                if (user) {
                    return done(null, user)
                }
                addLinkedInUser(profile)
                    .then(createdUser => done(null, createdUser))
                    .catch(err => done(err, null));
            })
            .catch(err => done(err, null));
    }));
};


function addLinkedInUser(profile: Profile): Promise<IUserDocument | null> {
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

    return User.addUser(newUser);
}