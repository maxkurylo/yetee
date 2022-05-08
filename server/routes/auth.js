const express = require("express");
const router = express.Router();
const User = require('../models/user');
const randomstring = require("randomstring");
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const passport = require("passport");
const generateUser = require('../user-registration');


const SECRET = process.env.SECRET;
const REDIRECT_URL_AFTER_EXTERNAL_LOGIN = process.env.REDIRECT_URL_AFTER_EXTERNAL_LOGIN;

function externalLogin(req, res) {
    const token = jwt.sign(req.user.toJSON(), SECRET, { expiresIn: config.sessionExpireTime });
    res.redirect(`${REDIRECT_URL_AFTER_EXTERNAL_LOGIN}?token=${token}`);
}

// facebook strategy
router.get("/facebook", passport.authenticate('facebook'));

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        session: false,
        failureRedirect: REDIRECT_URL_AFTER_EXTERNAL_LOGIN + '/login?failed=true'
    }),
    externalLogin
);

// google strategy
router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: REDIRECT_URL_AFTER_EXTERNAL_LOGIN + '/login?failed=true'
    }),
    externalLogin
);


// linkedin strategy
router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/linkedin/callback',
    passport.authenticate('linkedin', {
        session: false,
        failureRedirect: REDIRECT_URL_AFTER_EXTERNAL_LOGIN + '/login?failed=true'
    }),
    externalLogin
);



// local strategy
router.post("/login", (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });
    User.getUserByEmail(email, (err, user) => {
        if (err) return res.status(500).json({ error: err }); // database problem
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (config.emailVerificationNeeded && !user.emailIsVerified) {
            return res.status(401).json({ error: 'Email confirmation required' });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: err }); // database problem
            if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

            const token = jwt.sign(user.toJSON(), SECRET, { expiresIn: config.sessionExpireTime });
            res.json({ token });
        })
    });
});

router.post("/register", (req, res) => {
    const { name, email, password, avatarUrl } = req.body;

    const newUser = generateUser({
        name, email, password, avatarUrl
    });

    User.addUser(newUser, (err, user) => {
        if (err) return res.status(400).json({ error: err});

        if (config.emailVerificationNeeded) {
            res.json({ message: 'User added. Email verification needed'})
        } else {
            const token = jwt.sign(user.toJSON(), SECRET, { expiresIn: config.sessionExpireTime });
            res.json({ token });
        }
    });
});


router.post("/verify_email", (req, res) => {
    const { token } = req.body;

    User.verifyEmail(token, (err) => {
        if (err) return res.status(400).json({ success: false, message: 'Invalid verification token', error: err});
        res.send('Email verified!')
    });
});


router.get("/me", passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json(req.user.toJSON());

});

module.exports = router;
