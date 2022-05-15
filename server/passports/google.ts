import User  from '../models/user';
import { OAuth2Strategy, IOAuth2StrategyOption, Profile } from 'passport-google-oauth';
import { VerifiedCallback } from 'passport-jwt';
import passport from 'passport';
import generateUser  from '../generate-user';
import {IUserDocument} from "../typings/user";


export default function(clientID: string, clientSecret: string, callbackURL: string) {
    const opts: IOAuth2StrategyOption = {
        clientID,
        clientSecret,
        callbackURL,
    };

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