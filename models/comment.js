const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    attachments: [
        {
            filename: String,
            filepath: String
        }
    ]
});

module.exports = mongoose.model('Comment', commentSchema);
