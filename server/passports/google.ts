import User  from '../models/user';
import { OAuth2Strategy, IOAuth2StrategyOption, Profile } from 'passport-google-oauth';
import { VerifiedCallback } from 'passport-jwt';
import passport from 'passport';
import {IUser} from "../typings/user";

// TODO: check user email
// TODO: add user avatar
export default function(clientID: string, clientSecret: string, callbackURL: string) {
    const opts: IOAuth2StrategyOption = {
        clientID,
        clientSecret,
        callbackURL,
    };

    passport.use(new OAuth2Strategy(opts, (accessToken: string, refreshToken: string, profile: Profile, done: VerifiedCallback) => {
        User.findOne({ externalId: profile.id })
            .exec()
            .then(user => {
                if (user) {
                    // user exists, log it in
                    return done(null, user)
                }
                // create new user
                const newUser: IUser = {
                    name: profile.displayName,
                    email: profile.emails ? profile.emails[0].value : '',
                    externalId: profile.id,
                    // avatar: profile._json.picture,
                    isActive: true,
                };
                User.addUser(newUser)
                    .then(createdUser => done(null, createdUser))
                    .catch(err => done(err, null));
            })
            .catch(err => done(err, null));
    }));
};