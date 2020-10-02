
const mongoose = require('mongoose')
const User = require('../models/User')

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public',
        // Note: Give a possible range of options for a field.
        enum: ['public', 'private']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Story = mongoose.model('story', storySchema)

module.exports = Story