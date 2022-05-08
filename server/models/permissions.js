const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    resourceId: {
        type: String,
        required: true,
    },
    permissions: [String],
});

const Permission = module.exports = mongoose.model("Permissions", PermissionSchema);


module.exports.getPermissionsByUserId = function(userId, callback) {
    Permission.find({userId}, callback);
};

module.exports.addPermission = function(newPermission) {
    return new Promise((res, rej) => {
        newPermission.save((err, permission) => err ? rej(err) : res(permission));
    });
};

module.exports.alterPermissions = function(userId, resourceId, permissions, callback) {
    Permission.updateOne({ userId, resourceId }, { permissions }, callback);
};

module.exports.removePermission = function(userId, resourceId, callback) {
    Permission.deleteOne({userId, resourceId}, callback);
};