const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    entity: {
        type: String,
        required: true
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    changes: {
        type: Object
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
