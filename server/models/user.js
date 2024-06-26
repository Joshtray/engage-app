const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailToken: {
    type: String,
  },
  avatar: String,
  activities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
    },
  ],
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  interests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  chatRooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
    },
  ],
  currentMatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  matchSchedule: {
    type: String,
  },
  matchExpiry: {
    type: Date,
  },
  matchAcceptance: {
    type: String,
  },
  jobTitle: {
    type: String,
  },
  team: {
    type: String,
  },
  org: {
    type: String,
  },
  rouletteMatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rouletteExpiry: {
    type: Date,
  },
});

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  }
});

userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("You must provide a password.");

  try {
    const result = bcrypt.compare(password, this.password);
    return result;
  } catch (err) {
    console.log("comparePassword error: ", err);
  }
};

userSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error("You must provide an email address.");
  try {
    const user = await this.findOne({ email });
    return !!user;
  } catch (err) {
    console.log("isThisEmailInUse error: ", err);
    return false;
  }
};

module.exports = mongoose.model("User", userSchema);
