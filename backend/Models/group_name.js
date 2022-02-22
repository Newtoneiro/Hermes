const mongoose = require('mongoose');

const GroupNameSchema = mongoose.Schema({
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
})

module.exports = mongoose.model('groupName', GroupNameSchema)