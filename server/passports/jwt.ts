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
            .then(user => done(null, user))
            .catch(err => done(err, null));
    }));
};
