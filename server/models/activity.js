const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image: String,
    name: {
        type: String,
        required: true
    },
    description: String,
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }
});

module.exports = mongoose.model('Activity', activitySchema);
