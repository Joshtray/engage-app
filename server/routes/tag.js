const express = require("express");
const router = express.Router();
const Tags = require("../models/tag");

// Get all tags
router.get("/tags", async (req, res) => {
  try {
    const tags = await Tags.find();
    res.status(200).json({ success: true, tags });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
