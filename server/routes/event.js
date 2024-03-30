const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const { isAuth } = require("../middlewares/auth");

// Get all upcoming events for a user's company
router.get("/company-events", isAuth, async (req, res) => {
  try {
    const events = await Event.find({
      date: { $gte: new Date() },
      company: req.user.company,
    }).populate("tags attendees company");
    res.json({ success: true, events });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

module.exports = router;
