const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const {
  createUser,
  userSignIn,
  uploadProfile,
  userSignOut,
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

  const { password, ...sharedUser } = user._doc;
  res.json({ success: true, user: sharedUser });
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
  res.json({ success: true, user });
});

module.exports = router;
