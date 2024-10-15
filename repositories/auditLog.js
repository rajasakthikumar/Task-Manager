const BaseRepository = require('./baseRepository');
const AuditLog = require('../models/auditLog');
const CustomError = require('../util/customError');

class AuditLogRepository extends BaseRepository {
    constructor() {
        console.log("AuditLog Repository created");
        super(AuditLog);
    }

    async getLogs(filter = {}) {
        try {
            const logs = await this.model.find(filter)
                .populate('performedBy', 'username roles')
                .sort({ timestamp: -1 });
                
            return logs;
        } catch (error) {
            throw new CustomError(`Error fetching audit logs: ${error.message}`);
        }
    }
}

module.exports = AuditLogRepository;
