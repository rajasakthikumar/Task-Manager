const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    statusName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    nextStatuses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Status'
        }
    ],
    prevStatuses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Status'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: Date
});

module.exports = mongoose.model('Status', statusSchema);
