const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    companyId: String,
    participants: [String],
});

const Contact = module.exports = mongoose.model("Contacts", ContactSchema);


module.exports.getContactByName = function(name, callback) {
    const query = { name };
    Contact.findOne(query, callback);
};

module.exports.getContactById = function(id, callback) {
    Contact.findById(id, callback);
};

module.exports.getAllContacts = function(callback) {
    Contact.find({}, callback);
};

module.exports.addContact = function(newContact, callback) {
    newContact.save(callback);
};

module.exports.removeContactById = function(id, callback) {
    Contact.deleteOne({_id: id}, callback);
};