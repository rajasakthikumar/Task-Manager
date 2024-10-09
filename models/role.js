const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    permissions: [{
        type: String,
        required: true,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Role', roleSchema);
