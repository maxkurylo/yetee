import {getUserById} from '../models/user';
import { Strategy, ExtractJwt, VerifiedCallback, StrategyOptions } from 'passport-jwt';
import passport from 'passport';

export default function(jwtSecret: string) {
    const opts: StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtSecret,
    };

    passport.use(new Strategy(opts, (payload: any, done: VerifiedCallback) => {
        getUserById(payload.userId)
            .then(user => {
                if (user) {
                    return done(null, user)
                }
                done({ error: 'User not found' }, null)
            })
            .catch(err => done(err, null));
    }));
};
