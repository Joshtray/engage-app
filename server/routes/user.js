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
const parser = require("cron-parser");
const User = require("../models/user");
const Company = require("../models/company");
const Tag = require("../models/tag");
const Chatroom = require("../models/chatroom");
const multer = require("multer");
const { spawn } = require("child_process");
const Domain = require("../models/domain");

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
router.get("/users/:id", isAuth, async (req, res) => {
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
  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "Token is invalid/expired." });

  await User.findByIdAndUpdate(user._id, { isVerified: true, emailToken: "" });
  const companyId = user.company;
  if (companyId) {
    const company = await Company.findById(companyId);
    if (!company.employees.includes(user._id)) {
      company.employees.push(user);
      await company.save();
    }
  }

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

router.get("/is-registered", isAuth, async (req, res) => {
  const { user } = req;
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized", registered: false });

  const companyId = user.company;
  if (companyId) {
    const company = await Company.findById(companyId);
    if (company) {
      if (company.employees.includes(user._id)) {
        return res.status(200).json({
          success: true,
          message: "User registered",
          registered: true,
        });
      }
    }
  }
  const domain = await Domain.findOne({
    name: user.email.split("@")[1],
  }).populate("company");

  const company = domain ? domain.company : null;
  if (company) {
    if (!company.employees.includes(user._id)) {
      company.employees.push(user);
      await Company.findByIdAndUpdate(company._id, company);
    }
    await User.findByIdAndUpdate(user._id, { company: company._id });
    return res
      .status(200)
      .json({ success: true, message: "User registered", registered: true });
  } else {
    return res.status(200).json({
      success: true,
      message: "User not registered",
      registered: false,
    });
  }
});

router.get("/connection-requests", isAuth, async (req, res) => {
  try {
    const { user } = req;
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const currUser = await User.findById(user._id);
    const requests = await User.find({ _id: { $in: currUser?.requests } });
    return res.status(200).json({ success: true, requests });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/add-connection", isAuth, async (req, res) => {
  try {
    const { user } = req;
    const id = req.body.id;
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const currUser = await User.findById(user._id);
    if (!currUser.connections) {
      currUser.connections = [];
    }

    if (currUser.connections.includes(id))
      return res.status(400).json({
        success: false,
        message: "You are already connected to this user.",
      });

    if (currUser.sentRequests.includes(id))
      return res.status(400).json({
        success: false,
        message: "You have already sent a connection request to this user.",
      });

    if (currUser?.requests.includes(id)) {
      currUser.connections.push(id);

      currUser.requests = currUser.requests.filter(
        (requestId) => requestId.toString() !== id
      );

      // Create a chatroom between the two users
      const chatroom = new Chatroom({
        user1: currUser._id,
        user2: id,
      });
      await chatroom.save();

      if (!currUser.chatRooms) {
        currUser.chatRooms = [];
      }
      currUser.chatRooms.push(chatroom._id);

      const connUser = await User.findById(id);

      // Remove current user from sent requests
      connUser.sentRequests = connUser.sentRequests.filter(
        (requestId) => requestId.toString() !== currUser._id.toString()
      );

      if (!connUser.connections) {
        connUser.connections = [];
      }
      // Add current user to connections of connUser
      connUser.connections.push(currUser._id);

      if (!connUser.chatRooms) {
        connUser.chatRooms = [];
      }
      connUser.chatRooms.push(chatroom._id);

      await User.findByIdAndUpdate(connUser._id, connUser);
    } else {
      if (!currUser.sentRequests) {
        currUser.sentRequests = [];
      }
      currUser.sentRequests.push(id);

      const connUser = await User.findById(id);

      if (!connUser.requests) {
        connUser.requests = [];
      }
      connUser.requests.push(currUser._id);

      await User.findByIdAndUpdate(connUser._id, connUser);
    }

    await User.findByIdAndUpdate(currUser._id, currUser);
    return res.status(201).json({ success: true, user: currUser });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/update-profile", isAuth, async (req, res) => {
  try {
    const { user } = req;
    const { update } = req.body;
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const currUser = await User.findById(user._id);
    const updatedUser = { ...currUser._doc, ...update };
    await User.findByIdAndUpdate(currUser._id, updatedUser);
    return res.status(201).json({ success: true, user: updatedUser });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/update-match-schedule", isAuth, async (req, res) => {
  try {
    const { user } = req;
    const { schedule } = req.body;
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const currUser = await User.findById(user._id);
    currUser.matchSchedule = schedule;

    const interval = parser.parseExpression(schedule);
    currUser.matchExpiry = interval.next();
    await User.findByIdAndUpdate(currUser._id, currUser);
    return res.status(201).json({ success: true, user: currUser });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/get-match", isAuth, async (req, res) => {
  try {
    const { user } = req;
    var matchId;
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    if (user.currentMatch && user.matchExpiry > new Date()) {
      const match = await User.findById(user.currentMatch);
      const { password, emailToken, ...sharedUser } = match._doc;
      return res.status(200).json({ success: true, match: sharedUser });
    }

    if (user.matchSchedule) {
      const companyUsers = await User.find({ company: user.company });
      const tagIds = (await Tag.find({})).map((tag) => tag._id);
      const python = spawn("python", [
        "./utils/matcher.py",
        user._id,
        JSON.stringify(companyUsers),
        JSON.stringify(tagIds),
      ]);
      // collect data from script
      python.stdout.on("data", (data) => {
        console.log("Running matching algorithm ...");
        matchId = data.toString().trim();
      });
      python.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });
      // in close event we are sure that stream from child process is closed
      python.on("close", async (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        if (matchId) {
          const match = await User.findById(matchId);

          if (match) {
            user.currentMatch = matchId;
            user.matchAcceptance = "PENDING";
            const interval = parser.parseExpression(user.matchSchedule);
            user.matchExpiry = interval.next();

            await User.findByIdAndUpdate(user._id, user);
            const { password, emailToken, ...sharedUser } = match._doc;
            return res.status(200).json({ success: true, match: sharedUser });
          }

          return res
            .status(200)
            .json({ success: false, message: "No match found" });
        } else {
          return res
            .status(200)
            .json({ success: false, message: "No match found" });
        }
      });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "No match found" });
    }

    // const currUser = await User.findById(user._id);
    // const users = await User.find({});

    // const usersList = users.filter(
    //   (u) =>
    //     u._id.toString() !== currUser._id.toString() &&
    //     !currUser.connections.includes(u._id.toString()) &&
    //     !currUser.sentRequests.includes(u._id.toString()) &&
    //     !currUser.requests.includes(u._id.toString())
    // );

    // const match = usersList[Math.floor(Math.random() * usersList.length)];
    // return res.status(200).json({ success: true, match });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/lunch-roulette", isAuth, async (req, res) => {
  try {
    const { user } = req;
    const { refresh } = req.query;

    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    if (
      user.rouletteMatch &&
      user.rouletteExpiry > new Date() &&
      refresh === "false"
    ) {
      const match = await User.findById(user.rouletteMatch);
      const { password, emailToken, ...sharedUser } = match._doc;
      return res.status(200).json({ success: true, rouletteMatch: sharedUser });
    }

    const currUser = await User.findById(user._id);
    const usersList = await User.find({
      company: currUser.company,
      _id: { $ne: currUser._id },
    });

    const rouletteMatch =
      usersList[Math.floor(Math.random() * usersList.length)];

    // Update current user's roulette match
    currUser.rouletteMatch = rouletteMatch._id;
    // Match resets at the start of the next day
    currUser.rouletteExpiry = new Date(new Date().setHours(23, 59, 59, 999));

    await User.findByIdAndUpdate(currUser._id, currUser);

    return res.status(200).json({ success: true, rouletteMatch });
  } catch (error) {
    return res.status(500).json(error);
  }
});
module.exports = router;
