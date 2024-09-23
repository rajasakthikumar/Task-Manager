const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    action: {
        type:String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: false
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status',
        required: false
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Log',logSchema);