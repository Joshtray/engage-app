const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // activities: [
    //     {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Activity",
    //     },
    // ],
    });

module.exports = mongoose.model("Tag", tagSchema);