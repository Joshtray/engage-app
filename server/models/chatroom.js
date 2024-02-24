const mongoose = require('mongoose')

const chatRoomSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ]
})

module.exports = mongoose.model('ChatRoom', chatRoomSchema)