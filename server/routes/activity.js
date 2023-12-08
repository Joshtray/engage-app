const express = require("express");
const router = express.Router();
const Activity = require("../models/activity");
const User = require("../models/user");
const { isAuth } = require("../middlewares/auth");

// Create a new activity
router.post("/create-activity", isAuth, async (req, res) => {
  try {
    const activity = await Activity({ ...req.body, owner: req.user._id });

    if (!activity.participants) {
      activity.participants = [];
    }

    activity.participants.push(req.user._id);

    
    const user = await User.findById(req.user._id);
    if (!user.activities) {
        user.activities = [];
    }
    
    user.activities.push(activity);
    
    await activity.save();
    await User.findByIdAndUpdate(req.user._id, user);

    res.status(201).send({ success: true, activity });
  } catch (error) {
    res.status(400).send({ success: false, error });
  }
});

// Register for an activity
router.post("/register", isAuth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.body.id);
    const user = await User.findById(req.user._id);

    if (!activity.participants) {
      activity.participants = [];
    }
    if (activity.participants.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this activity.",
      });
    }
    activity.participants.push(user);
    await activity.save();

    if (!user.activities) {
      user.activities = [];
    }

    if (user.activities.includes(activity._id)) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this activity.",
      });
    }
    user.activities.push(activity);
    await User.findByIdAndUpdate(req.user._id, user);

    res.status(201).json({ success: true, activity });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error });
  }
});

// Get all activities
router.get("/activities", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ date: -1 });
    res.status(200).json({ success: true, activities });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all activities for a user
router.get("/my-activities", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("activities");
    res.status(200).json({ success: true, activities: user.activities });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
