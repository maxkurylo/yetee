import { Router, Request, Response } from 'express';
import {addUser, comparePassword, getUserByEmail, getUserById} from '../models/user';
import jwt, {SignOptions} from 'jsonwebtoken';
import config from '../config';
import passport, {AuthenticateOptions} from 'passport';
import {ErrorBody} from "../typings/error";
import jwtMiddleware from '../passports/jwt-middleware'
import {IUser} from "../typings/user";

const router = Router();

const JWT_SECRET: string = process.env.JWT_SECRET || '';
const APP_URL = process.env.APP_URL;

const ENABLE_LINKEDIN_LOGIN = process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET;
const ENABLE_GOOGLE_LOGIN = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
const ENABLE_FACEBOOK_LOGIN = process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET;

const passportOptions: AuthenticateOptions = {
    session: false,
    failureRedirect: APP_URL + '/login?failed=true'
};


if (!JWT_SECRET) {
    throw 'App secret is missing! Add JWT_SECRET environment variable'
}

if (ENABLE_FACEBOOK_LOGIN) {
    // Facebook strategy
    router.get('/facebook', passport.authenticate('facebook'));
    router.get('/facebook/callback', passport.authenticate('facebook', passportOptions), externalLogin);
}


if (ENABLE_GOOGLE_LOGIN) {
    // Google strategy
    router.get('/google', passport.authenticate('google', { scope: ['openid', 'email', 'profile'] }));
    router.get('/google/callback', passport.authenticate('google', passportOptions), externalLogin);
}

if (ENABLE_LINKEDIN_LOGIN) {
    // LinkedIn strategy
    router.get('/linkedin', passport.authenticate('linkedin'));
    router.get('/linkedin/callback', passport.authenticate('linkedin', passportOptions), externalLogin);
}



/**
 * Login for local strategy
 */
router.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const body: ErrorBody = {
            message: 'Missing email or password',
        };
        return res.status(400).json(body);
    }

    getUserByEmail(email, {email: 1, password: 1, isActive: 1})
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            comparePassword(password, user.password || '')
                .then(isMatch => {
                    if (isMatch) {
                        if (!user.isActive) {
                            const body: ErrorBody = {
                                message: 'Email confirmation required',
                            };
                            return res.status(401).json(body);
                        }
                        const token = generateToken(user._id.toString());
                        res.json({ token });
                    }
                })
                .catch(err => {
                    return res.status(401).json({ details: err.toString() });
                });
        })
        .catch(err => {
            const body: ErrorBody = {
                message: 'Incorrect email or password',
                details: err.toString()
            };
            res.status(401).json(body);
        });
});


/**
 * Sign up
 */
router.post('/sign-up', (req: Request, res: Response) => {
    const { name, email, password, avatarUrl } = req.body;

    const newUser: IUser = {
        name,
        email,
        password,
        avatarUrl,
        isActive: !config.emailVerificationNeeded,
    };

    addUser(newUser)
        .then(createdUser => {
            if (config.emailVerificationNeeded) {
                // TODO: generate token for email confirmation
                res.json({ message: 'User added. Email verification required'})
            } else {
                const token = generateToken(createdUser._id.toString());
                res.json({ token });
            }
        })
        .catch(err => {
            const body: ErrorBody = {
                message: 'Failed to create account',
                details: err
            };
            return res.status(500).json(body);
        });
});


/**
 * Check token for email verification
 */
router.post('/verify_email', (req: Request, res: Response) => {
    const { emailToken } = req.body;
    res.status(200);

});


/**
 * Get information about user
 */
router.get('/me', jwtMiddleware, (req: Request, res: Response) => {
    const userId = (req.user as any)._id;
    getUserById(userId, {password: 0, __v: 0})
        .then((user) => {
            if (!user) {
                const body: ErrorBody = { message: 'User not found' };
                return res.status(404).json(body);
            }
            res.status(200).json(user.toJSON());
        })
        .catch(err => {
            const body: ErrorBody = {
                message: 'Unable to find a user',
                details: err
            };
            res.status(500).json(body);
        });
});


/**
 * Get list of available external authentication services (e.g. Google, LinkedIn, Facebook)
 */
router.get('/available-external-auth', (req: Request, res: Response) => {
    const availableLogins = {
        linkedIn: ENABLE_LINKEDIN_LOGIN,
        facebook: ENABLE_FACEBOOK_LOGIN,
        google: ENABLE_GOOGLE_LOGIN,
    };
    res.status(200).json(availableLogins);
});


export default router;


function externalLogin(req: Request, res: Response) {
    const userId = (req.user as any)._id;
    const token = generateToken(userId);
    res.redirect(`${APP_URL}?token=${token}`);
}

function generateToken(userId: string): string {
    const opts: SignOptions = {
        expiresIn: process.env.SESSION_EXPIRE_TIME || '1d'
    };
    return jwt.sign({ userId }, JWT_SECRET, opts);
}
