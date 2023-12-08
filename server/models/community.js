const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  // owner: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User'
  // },
  name: {
    type: String,
    required: true,
  },
  description: String,
  imageUri: String,
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Community", communitySchema);
