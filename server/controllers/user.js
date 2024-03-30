const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Domain = require("../models/domain");
const sharp = require("sharp");
const cloudinary = require("../helper/imageUpload");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

exports.createUser = async (req, res) => {
  const { fullname, email, password } = req.body;
  const userExists = await User.isThisEmailInUse(email);
  if (userExists)
    return res.json({ success: false, message: "Email is already in use." });
  const emailToken = crypto.randomBytes(64).toString("hex");

  const domain = await Domain.findOne({ name: email.split("@")[1] });

  const company = domain ? domain.company : null;

  const user = await User({
    fullname,
    email,
    password,
    emailToken,
    company,
  });
  await user.save();
  this.sendEmail(user.email, user.fullname, emailToken);
  res.json({ success: true, user });
};

exports.sendEmail = (email, fullname, emailToken) => {
  var transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const url = `${process.env.API_URL}/verify-email/${emailToken}`;

  const mailOptions = {
    from: '"engage" <jesseyuchenwichi@outlook.com>',
    to: email,
    subject: "engage: Please verify your email address.",
    html: `<h1>Email Confirmation</h1>
    <h2>Hello ${fullname},</h2>
    <p>Thank you for signing up to use engage! Please confirm your email by clicking <a href=${url}> this link</a>.</p>
    </div>`,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
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

  const { password: userPassword, emailToken, ...userInfo } = user._doc;
  userInfo.avatar = user.avatar || "";

  res.json({
    success: true,
    message: "You are logged in.",
    user: userInfo,
    token,
  });
};

exports.userSignOut = async (req, res) => {
  const { user } = req;
  if (!user) return res.json({ success: false, message: "Unauthorized" });

  const token = req?.headers?.authorization;
  if (!token) return res.json({ success: false, message: "Unauthorized" });

  res.json({ success: true, message: "You are logged out." });
};

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

    await User.findByIdAndUpdate(user._id, { avatar: result.secure_url });

    res
      .status(201)
      .json({ success: true, message: "Profile uploaded successfully" });
  } catch (err) {
    console.log("Error while uploading profile: ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
