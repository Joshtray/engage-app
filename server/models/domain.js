const mongoose = require("mongoose");

const domainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    });

module.exports = mongoose.model("Domain", domainSchema); 