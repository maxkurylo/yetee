const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    avatarUrl: String,
    posts: [String],
    companyId: String,
});

const Group = module.exports = mongoose.model("Groups", GroupSchema);


module.exports.getGroupById = function(id, callback) {
    Group.findById(id, callback);
};

module.exports.getAllGroups = function(callback) {
    Group.find({}, callback);
};

module.exports.getAllGroupsByCompanyId = function(companyId, callback) {
    Group.find(companyId, callback);
};

module.exports.addGroup = function(userId, newGroup, callback) {
    newGroup.save(callback);
};

module.exports.removeGroupById = function(id, callback) {
    Group.deleteOne({_id: id}, callback);
};