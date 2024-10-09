const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
    filename: String,
    filepath: String
});

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
    attachments: [attachmentSchema]
});

module.exports = mongoose.model('Comment', commentSchema);
