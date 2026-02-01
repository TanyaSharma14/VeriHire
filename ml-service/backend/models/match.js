const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema(
  {
    resumeText: { type: String, required: true },
    jobText: { type: String, required: true },
    resumeSkills: [String],
    jobSkills: [String],
    matchScore: Number,
    missingSkills: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", MatchSchema);
