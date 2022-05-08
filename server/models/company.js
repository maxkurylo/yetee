const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    avatarUrl: String
});

const Company = module.exports = mongoose.model("Companies", CompanySchema);


module.exports.getCompanyById = function(id, callback) {
    Company.findById(id, callback);
};

module.exports.getAllCompanies = function(callback) {
    Company.find({}, callback);
};

module.exports.addCompany = function(newCompany, callback) {
    newCompany.save(callback);
};

module.exports.removeCompanyById = function(id, callback) {
    Company.deleteOne({_id: id}, callback);
};