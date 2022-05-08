const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    resourceId: String, // contactId or groupId
    startTime: Number,
    endTime: Number,
    isActive: Boolean,
    companyId: String,
});

const Meeting = module.exports = mongoose.model("Meetings", MeetingSchema);


module.exports.getMeetingsByResourceId = function(resourceId, callback) {
    const query = { resourceId };
    Meeting.find(query, callback);
};

module.exports.getMeetingById = function(id, callback) {
    Meeting.findById(id, callback);
};

module.exports.getAllActiveMeetings = function(callback) {
    Meeting.find({isActive: true}, callback);
};

module.exports.addMeeting = function(newMeeting, callback) {
    newMeeting.save(callback);
};

module.exports.editMeeting = function(id, newName, callback) {
    Meeting.updateOne({ _id: id }, { name: newName }, callback);
};

module.exports.removeMeetingById = function(id, callback) {
    Meeting.deleteOne({_id: id}, callback);
};