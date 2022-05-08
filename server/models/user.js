const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    emailIsVerified: {
        type: Boolean,
        default: false
    },
    password: String,
    avatarUrl: String,
    emailVerificationToken: String,
    email: String, // used for local strategy
    facebook_id:  String,
    google_id: String,
    linkedin_id: String,
    status: String, // online | offline | in-meeting | undefined
});

const Users = module.exports = mongoose.model("Users", UserSchema);

module.exports.getUserByEmail = function(email, callback) {
    const query = { email };
    Users.findOne(query, callback);
};

module.exports.getUserByLogin = function(login, callback) {
    const query = { login };
    Users.findOne(query, callback);
};

module.exports.getUserById = function(id, callback) {
    Users.findById(id, callback);
};

module.exports.getAllUsers = function(callback) {
    Users.find({}, callback);
};

// AUTH
module.exports.addUser = function(newUser, callback) {
    if (newUser.password) {
        bcrypt.hash(newUser.password, 10, (err, hash) => {
            if (err) return callback(err, null);
            newUser.password = hash;
            newUser.save(callback);
        });
    } else {
        newUser.save(callback);
    }
};

module.exports.verifyEmail = function(token, callback) {
    const query = { emailVerificationToken: token };
    const update = { emailIsVerified: true };
    Users.findOneAndUpdate(query, update, callback);
};

module.exports.comparePassword = function(userPass, dbPass, callback) {
    if (userPass && dbPass) {
        bcrypt.compare(userPass, dbPass, (err, isMatch) => {
            if (err) return callback(err, false);
            callback(null, isMatch);
        });
    } else {
        callback(null, false);
    }
};