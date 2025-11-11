const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
  // --- 1. Basic Info ---
  businessName: String,
  fullName: String,
  age: Number,
  mobile: String,
  email: String,
  address: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  education: String,

  // --- 2. Business Details ---
  businessDescription: String,
  productDescription: String,
  novelty: String,
  teamSize: String,
  competitors: String,
  marketSize: String,
  marketSurvey: String,
  validationSurvey: String,
  projectCostEstimate: String,
  revenueModel: String,
  machineryNeeded: String,

  // --- 3. Cost Breakup ---
  preOp: Number,
  prototype: Number,
  marketing: Number,
  equipment: Number,
  capital: Number,
  other: Number,
  totalCost: Number,

  // --- 4. References ---
  ref1Name: String,
  ref1Org: String,
  ref1Address: String,
  ref1Phone: String,
  ref1Email: String,
  ref2Name: String,
  ref2Org: String,
  ref2Address: String,
  ref2Phone: String,
  ref2Email: String,

  // --- 5. Declaration ---
  declaration: Boolean,
  date: Date,
  place: String,

  // --- Metadata ---
  submissionDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Applicant", applicantSchema);
