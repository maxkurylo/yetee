import User, {IUserDocument} from '../models/user';
import {Strategy, StrategyOption, Profile} from 'passport-facebook';
import { VerifiedCallback } from 'passport-jwt';
import { PassportStatic } from 'passport';
import { generateUser}  from '../user-registration';


const FACEBOOK_CLIENT_ID: string = process.env.FACEBOOK_CLIENT_ID || '';
const FACEBOOK_CLIENT_SECRET: string = process.env.FACEBOOK_CLIENT_SECRET || '';
const APP_URL: string = process.env.APP_URL || '';

const opts: StrategyOption = {
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: `${APP_URL}/api/auth/facebook/callback`
};

export default function(passport: PassportStatic) {
    passport.use(new Strategy(opts, (accessToken: string, refreshToken: string, profile: Profile, done: VerifiedCallback) => {
        User.findOne({ facebook_id: profile.id })
            .exec()
            .then(user => {
                if (user) {
                    return done(null, user)
                }
                addFacebookUser(profile)
                    .then(createdUser => done(null, createdUser))
                    .catch(err => done(err, null));
            })
            .catch(err => done(err, null));
    }));
}


function addFacebookUser(profile: Profile): Promise<IUserDocument | null> {
    const newUser = generateUser({
        name: profile.displayName,
        facebook_id: profile.id
    });

    return User.addUser(newUser);
}