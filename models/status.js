const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    statusName: {
        type: String,
        required: true
    },
    nextStatus: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Status',
    }], 
    previousStatus:[ {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Status',
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Status = mongoose.model('Status', statusSchema);

module.exports = Status; 
