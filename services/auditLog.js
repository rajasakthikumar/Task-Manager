const BaseService = require('./baseService');

class AuditLogService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    async getAuditLogs(filter = {}, options = {}) {
        return await this.repository.getLogs(filter, options);
    }

    async create(logData) {
        try {
            const auditLog = await this.repository.create(logData);
            return auditLog;
        } catch (error) {
            throw new CustomError(`Error creating audit log: ${error.message}`);
        }
    }
}

module.exports = AuditLogService;
