const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
    notification_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    room_id: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('notifications', NotificationSchema)