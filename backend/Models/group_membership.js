const mongoose = require('mongoose');

const GroupMembershipSchema = mongoose.Schema({
    group_membership_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true
    },
    group_id: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('groupMembership', GroupMembershipSchema)