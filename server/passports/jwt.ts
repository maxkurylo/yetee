import User from '../models/user';
import {Strategy, ExtractJwt, VerifiedCallback, StrategyOptions} from 'passport-jwt';
import {PassportStatic} from 'passport';

const SECRET = process.env.SECRET;

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
};

export default function(passport: PassportStatic) {
    passport.use(new Strategy(opts, (jwtPayload: any, done: VerifiedCallback) => {
        User.findOne({_id: jwtPayload.id})
            .exec()
            .then(user => done(null, user))
            .catch(err => done(err, null));
    }));
};
