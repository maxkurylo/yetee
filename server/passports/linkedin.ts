import User from '../models/user';
import {Strategy, StrategyOption, Profile} from 'passport-linkedin-oauth2';
import { VerifiedCallback } from 'passport-jwt';
import generateUser from '../generate-user';
import passport from 'passport';
import {IUserDocument} from "../typings/user";


export default function(clientID: string, clientSecret: string, callbackURL: string) {
    const opts: StrategyOption = {
        clientID,
        clientSecret,
        callbackURL,
        scope: ['r_emailaddress', 'r_liteprofile'],
    };

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