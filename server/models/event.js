const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
});

module.exports = mongoose.model("Event", eventSchema);
