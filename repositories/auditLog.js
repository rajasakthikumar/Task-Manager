// repositories/auditLogRepository.js
const BaseRepository = require('./baseRepository');
const AuditLog = require('../models/auditLog');

class AuditLogRepository extends BaseRepository {
    constructor() {
        console.log("AuditLog Repository created");
        super(AuditLog);
    }

    async getLogs(filter = {}, options = {}) {
        try {
            const logs = await this.model.find(filter)
                .populate('performedBy', 'username roles')
                .sort({ timestamp: -1 })
                .skip(options.skip || 0)
                .limit(options.limit || 20);
            return logs;
        } catch (error) {
            throw new Error(`Error fetching audit logs: ${error.message}`);
        }
    }
}

module.exports = AuditLogRepository;
