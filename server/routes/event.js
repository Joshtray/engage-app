const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const { isAuth } = require("../middlewares/auth");

// Get all events for a user's company
router.get("/company-events", isAuth, async (req, res) => {
  try {
    const events = await Event.find({ company: req.user.company });
    console.log(events);
    res.json({ success: true, events });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

module.exports = router;
