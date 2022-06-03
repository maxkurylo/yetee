import {addUser, getUserByExternalId} from '../models/user';
import {Strategy, StrategyOption, Profile} from 'passport-linkedin-oauth2';
import { VerifiedCallback } from 'passport-jwt';
import passport from 'passport';
import {IUser} from "../typings/user";

// TODO: take care of avatar
export default function(clientID: string, clientSecret: string, callbackURL: string) {
    const opts: StrategyOption = {
        clientID,
        clientSecret,
        callbackURL,
        scope: ['r_emailaddress', 'r_liteprofile'],
    };

    passport.use(new Strategy(opts, (accessToken: string, refreshToken: string, profile: Profile, done: VerifiedCallback) => {
        getUserByExternalId(profile.id)
            .then(user => {
                if (user) {
                    // user exists, log it in
                    return done(null, user)
                }
                // create new user
                const newUser: IUser = {
                    name: profile.displayName,
                    externalId: profile.id,
                    email: profile.emails[0].value,
                    isActive: true,
                };
                addUser(newUser)
                    .then(createdUser => done(null, createdUser))
                    .catch(err => done(err, null));
            })
            .catch(err => done(err, null));
    }));
};