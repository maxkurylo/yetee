const User = require('./models/user');
const randomstring = require("randomstring");

module.exports = function(userData = {}) {
    const { name, email, password, avatarUrl, google_id, facebook_id, linkedin_id } = userData;

    const login = randomstring.generate({ length: 10 });
    const emailVerificationToken = randomstring.generate({ length: 64 });
    return new User({
        name,
        email,
        password,
        login,
        avatarUrl,
        emailVerificationToken,
        emailIsVerified: !!(google_id || facebook_id || linkedin_id),
        google_id,
        facebook_id,
        linkedin_id
    });
};