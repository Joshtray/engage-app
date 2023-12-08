const express = require("express");
const { check } = require("express-validator");
const crypto = require("crypto");

const router = express.Router();
const {
  createUser,
  userSignIn,
  uploadProfile,
  userSignOut,
  sendEmail,
} = require("../controllers/user");
const {
  validateUserSignUp,
  userValidationResult,
  validateUserSignIn,
} = require("../middlewares/validation/user");
const { isAuth } = require("../middlewares/auth");

const User = require("../models/user");
const multer = require("multer");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Invalid image file!", false);
  }
};
const uploads = multer({ storage, fileFilter });

router.post(
  "/create-user",
  validateUserSignUp,
  userValidationResult,
  createUser
);
router.post("/sign-in", validateUserSignIn, userValidationResult, userSignIn);
router.get("/sign-out", isAuth, userSignOut);
router.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  const { password, emailToken, ...sharedUser } = user._doc;
  res.json({ success: true, user: sharedUser });
});

router.get("/send-verification-email", isAuth, async (req, res) => {
  const { user } = req;
  if (!user)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  const { fullname, email } = user;
  const emailToken = crypto.randomBytes(64).toString("hex");
  
  sendEmail(email, fullname, emailToken);
  
  await User.findByIdAndUpdate(user._id, { emailToken });
  res.status(200).json({ success: true, message: "Email sent" });
});

router.get("/verify-email/:emailToken", async (req, res) => {
  const { emailToken } = req.params;
  const user = await User.findOne({ emailToken });
  console.log(user);
  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "Token is invalid/expired." });

  await User.findByIdAndUpdate(user._id, { isVerified: true, emailToken: "" });
  res.status(200).json({ success: true, message: "User verified" });
});

router.post(
  "/upload-profile",
  isAuth,
  uploads.single("profile"),
  uploadProfile
);

router.get("/profile", isAuth, async (req, res) => {
  const { user } = req;
  if (!user)
    return res.status(401).json({ success: false, message: "Unauthorized" });
  res.status(200).json({ success: true, user });
});

module.exports = router;
