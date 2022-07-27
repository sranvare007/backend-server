import mongoose from "mongoose";

const recruitmentSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: 0,
  },
  companyName: {
    type: String,
    required: [true, "Please provide a valid companyName."],
  },
  rolesHiring: {
    type: [String],
    required: [true, "Please provide valid recruitment roles."],
  },
  eligibilityCriteria: {
    type: String,
    required: [true, "Please provide a valid eligibility criteria."],
  },
  minCtcProvided: {
    type: Number,
    required: [true, "Please provide a valid ctcProvided."],
  },
  maxCtcProvided: {
    type: Number,
    required: [true, "Please provide a valid ctcProvided."],
  },
  batchRecruitingFor: {
    type: String,
    required: [true, "Please provide a valid batchRecruitingFor."],
  },
  jobLocation: {
    type: String,
    required: [true, "Please provide a valid jobLocation."],
  },
  minCGPA: {
    type: Number,
    required: [true, "Please provide a valid minCGPA."],
  },
});

export const Recruitment = mongoose.model("Recruitment", recruitmentSchema);
