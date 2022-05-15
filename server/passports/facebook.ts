import User from '../models/user';
import {Strategy, StrategyOption, Profile} from 'passport-facebook';
import { VerifiedCallback } from 'passport-jwt';
import passport from 'passport';
import generateUser from '../generate-user';
import {IUserDocument} from "../typings/user";


export default function(clientID: string, clientSecret: string, callbackURL: string) {
    const opts: StrategyOption = {
        clientID,
        clientSecret,
        callbackURL,
    };

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