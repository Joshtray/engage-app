const jwt = require("jsonwebtoken");

const User = require("../models/user");
const sharp = require("sharp");
const cloudinary = require("../helper/imageUpload");

exports.createUser = async (req, res) => {
  const { fullname, email, password } = req.body;
  const userExists = await User.isThisEmailInUse(email);
  if (userExists)
    return res.json({ success: false, message: "Email is already in use." });
  const user = await User({
    fullname,
    email,
    password,
  });
  await user.save();
  res.json({ success: true, user });
};

exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.json({ success: false, message: "Email not found." });

  const isMatch = await user.comparePassword(password);

  if (!isMatch)
    return res.json({ success: false, message: "Invalid password." });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const userInfo = {
    fullname: user.fullname,
    email: user.email,
    avatar: user.avatar || '',
  };

  res.json({ success: true, message: "You are logged in.", user: userInfo, token });
};

exports.userSignOut = async (req, res) => {
  const { user } = req;
  if (!user) return res.json({ success: false, message: "Unauthorized" });

  const token = req?.headers?.authorization;
  if (!token) return res.json({ success: false, message: "Unauthorized" });

  res.json({ success: true, message: "You are logged out." });
}

exports.uploadProfile = async (req, res) => {
  const { user } = req;
  if (!user)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${user._id}_profile`,
      width: 500,
      height: 500,
      crop: "fill",
      overwrite: true,
    });

    await User.findByIdAndUpdate(user._id, { avatar:result.url });

    res
      .status(201)
      .json({ success: true, message: "Profile uploaded successfully" });
  } catch (err) {
    console.log("Error while uploading profile: ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
