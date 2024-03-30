const express = require("express");
const router = express.Router();
const Activity = require("../models/activity");
const User = require("../models/user");
const Company = require("../models/company");
const { isAuth } = require("../middlewares/auth");
const multer = require("multer");
const { uploadActivityImage } = require("../controllers/activity");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Invalid image file!", false);
  }
};
const uploads = multer({ storage, fileFilter });

// Create a new activity
router.post(
  "/create-activity",
  isAuth,
  uploads.single("image"),
  async (req, res, next) => {
    try {
      if (!req.user.company) {
        return res
          .status(400)
          .json({ success: false, message: "Unauthorized" });
      }

      const activity = await Activity({
        ...req.body,
        owner: req.user._id,
        company: req.user.company,
      });

      if (!activity.participants) {
        activity.participants = [];
      }

      activity.participants.push(req.user._id);

      const user = await User.findById(req.user._id);
      if (!user.activities) {
        user.activities = [];
      }

      user.activities.push(activity);

      const company = await Company.findById(req.user.company);
      if (!company.activities) {
        company.activities = [];
      }
      company.activities.push(activity);

      await activity.save();
      await User.findByIdAndUpdate(req.user._id, user);
      await Company.findByIdAndUpdate(req.user.company, company);

      req.activity = activity;
      next();
    } catch (error) {
      return res.status(400).send({ success: false, error });
    }
  },
  uploadActivityImage
);

// Register for an activity
router.post("/register", isAuth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.body.id);
    const user = await User.findById(req.user._id);

    // If the activity is not part of the company
    if (activity.company.toString() !== user.company.toString()) {
      return res.status(400).json({
        success: false,
        message: "You are not allowed to register for this activity.",
      });
    }

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

router.post("/unregister", isAuth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.body.id);
    if (!activity) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }
    const user = await User.findById(req.user._id);
    if (!activity.participants.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "You are not registered for this activity",
      });
    }
    activity.participants = activity.participants.filter(
      (participantId) => participantId.toString() !== user._id.toString()
    );
    await Activity.findByIdAndUpdate(activity._id, activity);
    user.activities = user.activities.filter(
      (activityId) => activity._id.toString() !== activityId.toString()
    );
    await User.findByIdAndUpdate(user._id, user);
    res.status(200).json({ success: true, activity });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
});

// Get all activities
router.get("/activities", isAuth, async (req, res) => {
  try {
    const companyId = req.user.company;
    if (!companyId) {
      return res.status(400).json({ success: false, message: "Unauthorized" });
    }

    const company = await Company.findById(companyId).populate("activities");
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }
    // Sort activities by date and pick only the ones that are not past
    const activities = company.activities
      .filter((activity) => activity.date > new Date())
      .sort((a, b) => a.date - b.date);
    res.status(200).json({ success: true, activities });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all activities that a user has registered for
router.get("/registered-activities", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("activities");
    // Sort activities by date and pick only the ones that are not past
    const activities = user.activities
      .filter((activity) => activity.date > new Date())
      .sort((a, b) => a.date - b.date);
    res.status(200).json({ success: true, activities });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all the activities that a user owns
router.get("/my-activities", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("activities");
    // Sort activities by date
    const activities = user.activities
      .filter(
        (activity) =>
          activity.owner.toString() === user._id.toString() &&
          activity.date > new Date()
      )
      .sort((a, b) => a.date - b.date);
    res.status(200).json({ success: true, activities });
  } catch (error) {
    res.status
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// Get all a user's activities that have completed
router.get("/past-activities", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("activities");
    // Sort activities by date
    const activities = user.activities
      .filter((activity) => activity.date < new Date())
      .sort((a, b) => b.date - a.date);
    res.status(200).json({ success: true, activities });
  } catch (error) {
    res.status
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// Update an activity
router.post(
  "/update-activity",
  isAuth,
  uploads.single("image"),
  async (req, res, next) => {
    try {
      const { image, ...updateInfo } = req.body;
      const activity = await Activity.findById(req.body.id);
      if (!activity) {
        return res
          .status(404)
          .json({ success: false, message: "Activity not found" });
      }
      if (activity.owner.toString() !== req.user._id.toString()) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      const updatedActivity = await Activity.findByIdAndUpdate(
        req.body.id,
        updateInfo,
        { new: true }
      );
      if (!req.file) {
        res.status(200).json({ success: true, activity: updatedActivity });
      } else {
        req.activity = updatedActivity;
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error });
    }
  },
  uploadActivityImage
);

// Delete an activity
router.post("/delete-activity", isAuth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.body.id);
    if (!activity) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }
    if (activity.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    // Remove the activity from the company, owner and participants
    await Company.findByIdAndUpdate(activity.company, {
      $pull: { activities: activity._id },
    });
    await User.updateMany(
      { _id: { $in: activity.participants } },
      { $pull: { activities: activity._id } }
    );

    await Activity.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "Activity deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.get("/search", isAuth, async (req, res) => {
  const { user } = req;
  const { query } = req.query;
  try {
    const pipeline = [
      {
        $search: {
          index: "activities",
          compound: {
            must: [
              {
                text: {
                  query,
                  path: ["name", "description", "location"],
                  fuzzy: {},
                },
              },
              { equals: { value: user.company, path: "company" } },
            ],
          },
          // autocomplete: { query, path: "name" },
        },
      },
      {
        $project: {
          _id: 1,
          score: { $meta: "searchScore" },
          name: 1,
          description: 1,
          date: 1,
          location: 1,
          participants: 1,
          company: 1,
          owner: 1,
          image: 1,
        },
      },
      {
        $sort: {
          score: -1,
        },
      },
    ];

    const activities = await Activity.aggregate(pipeline);

    res.status(200).json({ success: true, activities });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;