import { Router, Request, Response } from 'express';
import User from '../models/user';
import jwt, {SignOptions} from 'jsonwebtoken';
import config from '../config';
import passport, {AuthenticateOptions} from 'passport';
import generateUser  from '../generate-user';
import {ErrorBody} from "../typings/error";
import jwtMiddleware from '../passports/jwt-middleware'

const router = Router();

const JWT_SECRET: string = process.env.JWT_SECRET || '';
const EXTERNAL_LOGIN_REDIRECT_URL = process.env.REDIRECT_URL_AFTER_EXTERNAL_LOGIN;

const ENABLE_LINKEDIN_LOGIN = process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET;
const ENABLE_GOOGLE_LOGIN = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
const ENABLE_FACEBOOK_LOGIN = process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET;

const passportOptions: AuthenticateOptions = {
    session: false,
    failureRedirect: EXTERNAL_LOGIN_REDIRECT_URL + '/login?failed=true'
};


if (!JWT_SECRET) {
    throw 'App secret is missing! Add JWT_SECRET environment variable'
}


// Facebook strategy
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', passportOptions), externalLogin);

// Google strategy
router.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
router.get('/google/callback', passport.authenticate('google', passportOptions), externalLogin);


// LinkedIn strategy
router.get('/linkedin', passport.authenticate('linkedin'));
router.get('/linkedin/callback', passport.authenticate('linkedin', passportOptions), externalLogin);


/**
 * Login for local strategy
 */
router.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
    }
    User.getUserByEmail(email)
        .then(user => {
            if (user.comparePassword(password, user.password)) {
                if (!user.emailIsVerified) {
                    return res.status(401).json({ error: 'Email confirmation required' });
                }
                const token = generateToken(user._id);
                res.json({ token });
            }
        })
        .catch(err => {
            const body: ErrorBody = {
                message: 'Incorrect email or password',
                details: err
            };
            res.status(401).json(body);
        });
});


/**
 * Sign up
 */
router.post('/sign-up', (req: Request, res: Response) => {
    const { name, email, password, avatarUrl } = req.body;

    const newUser = generateUser({
        name, email, password, avatarUrl
    });

    User.addUser(newUser)
        .then(user => {
            if (config.emailVerificationNeeded) {
                res.json({ message: 'User added. Email verification needed'})
            } else {
                const token = generateToken(user._id);
                res.json({ token });
            }
        })
        .catch(err => {
            const body: ErrorBody = {
                message: 'Failed to create account',
                details: err
            };
            return res.status(500).json(body)
        });
});


/**
 * Check token for email verification
 */
router.post('/verify_email', (req: Request, res: Response) => {
    const { token } = req.body;

    User.verifyEmail(token, (err) => {
        if (err) return res.status(400).json({ success: false, message: 'Invalid verification token', error: err});
        res.send('Email verified!')
    });
});


/**
 * Get information about user
 */
router.get('/me', jwtMiddleware, (req: Request, res: Response) => {
    res.json(req.user.toJSON());
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
    const token = generateToken(req.user._id);
    res.redirect(`${EXTERNAL_LOGIN_REDIRECT_URL}?token=${token}`);
}

function generateToken(userId: string): string {
    const opts: SignOptions = {
        expiresIn: config.sessionExpireTime
    };
    return jwt.sign(userId, JWT_SECRET, opts);
}
