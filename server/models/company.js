const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
});

module.exports = mongoose.model("Company", companySchema);