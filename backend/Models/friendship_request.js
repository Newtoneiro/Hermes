const mongoose = require('mongoose');

const FriendshipRequestSchema = mongoose.Schema({
    friendships_requests_id: {
        type: String,
        required: true
    },
    user1_id: {
        type: String,
        required: true
    },
    user2_id: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('friendships_requests', FriendshipRequestSchema)