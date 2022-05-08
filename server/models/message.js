const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    resourceId: String, // contactId or groupId
    timestamp: Number,
    senderId: String,
    text: String,
    attachmentUrl: String,
});

const Message = module.exports = mongoose.model("Messages", MessageSchema);

module.exports.getMessagesByResourceId = function(resourceId, callback) {
    const query = { resourceId };
    Message.find(query, callback);
};

module.exports.addMessage = function(newMessage, callback) {
    newMessage.save(callback);
};

module.exports.editMessage = function(id, newText, callback) {
    Message.updateOne({ _id: id }, { text: newText }, callback);
};

module.exports.removeMessageById = function(id, callback) {
    Message.deleteOne({_id: id}, callback);
};