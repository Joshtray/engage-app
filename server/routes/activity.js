const express = require('express');
const router = express.Router();
const Activity = require('../models/activity');
const { isAuth } = require('../middlewares/auth');

// Create a new activity
router.post('/create-activity', isAuth, async (req, res) => {
    try {
        const activity = await Activity({...req.body, owner: req.user._id });
        await activity.save();
        res.status(201).send({success: true, activity});
    } catch (error) {
        res.status(400).send({success: false, error});
    }
});

// Get all activities
router.get('/activities', async (req, res) => {
    try {
        const activities = await Activity.find({}).sort({date: -1});
        res.status(200).json({success: true, activities});
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
