const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    chatRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom'
    },
    sentAt: {
        type: Date,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Message', messageSchema)