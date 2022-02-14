const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    message_id: {
        type: String,
        required: true
    },
    room_id: {
        type: String,
        required: true
    },
    sender_id: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
    }
})

module.exports = mongoose.model('Message', MessageSchema)
