const mongoose = require('mongoose');

const FriendshipSchema = mongoose.Schema({
    friendships_id: {
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

module.exports = mongoose.model('friendships', FriendshipSchema)