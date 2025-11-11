const mongoose = require('mongoose');
const applicantSchema = new mongoose.Schema({
  businessName: String,
  fullName: String,
  email: String,
  submissionDate: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Applicant', applicantSchema);