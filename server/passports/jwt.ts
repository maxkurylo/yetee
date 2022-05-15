import User from '../models/user';
import { Strategy, ExtractJwt, VerifiedCallback, StrategyOptions } from 'passport-jwt';
import passport from 'passport';

export default function(jwtSecret: string) {
    const opts: StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtSecret,
    };

    passport.use(new Strategy(opts, (userId: string, done: VerifiedCallback) => {
        User.findOne({_id: userId})
            .exec()
            .then(user => done(null, user))
            .catch(err => done(err, null));
    }));
};
