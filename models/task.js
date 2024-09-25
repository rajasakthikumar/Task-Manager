const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'Status', required: true },
    createdDate: { type: Date, default: Date.now },
    endDate: Date,
    modifiedDate: Date,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // User who created the task
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // User to whom the task is assigned
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    priority:{
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    }  
});

module.exports = mongoose.model('Task', taskSchema);
