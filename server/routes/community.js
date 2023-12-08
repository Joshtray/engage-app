const express = require("express");
const router = express.Router();
const Community = require("../models/community");
const User = require("../models/user");
const { isAuth } = require("../middlewares/auth");

// // Create a new activity
// router.post("/new-community", isAuth, async (req, res) => {
//   try {
//     const activity = await Activity({ ...req.body, owner: req.user._id });
//     await activity.save();

//     const user = await User.findById(req.user._id);
//     user.activities.push(activity);

//     await user.save();

//     res.status(201).send({ success: true, activity });
//   } catch (error) {
//     res.status(400).send({ success: false, error });
//   }
// });

// Join a community
router.post("/join", isAuth, async (req, res) => {
  try {
    const community = await Community.findById(req.body.id);
    const user = await User.findById(req.user._id);

    if (!community.members) {
      community.members = [];
    }
    if (community.members.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this community.",
      });
    }
    community.members.push(user);
    await community.save();

    if (!user.communities) {
      user.communities = [];
    }

    if (user.communities.includes(community._id)) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this community",
      });
    }
    user.communities.push(community);
    await User.findByIdAndUpdate(req.user._id, user);

    res.status(201).json({ success: true, community });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error });
  }
});

// Get all communities
router.get("/communities", async (req, res) => {
  try {
    const communities = await Community.find().sort({ name: -1 });
    res.status(200).json({ success: true, communities });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Get all communities for a user
router.get("/my-communities", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("communities");
    res.status(200).json({ success: true, communities: user.communities });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
