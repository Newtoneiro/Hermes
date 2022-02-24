const mongoose = require('mongoose');

const GroupInfoSchema = mongoose.Schema({
    group_name_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    group_id: {
        type: String,
        required: true
    },
    owner_id: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('groupInfo', GroupInfoSchema)