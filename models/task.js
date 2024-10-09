const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status',
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    endDate: Date,
    modifiedDate: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedDate: {
        type: Date
    }
});

module.exports = mongoose.model('Task', taskSchema);
