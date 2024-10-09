// services/auditLogService.js
const BaseService = require('./baseService');

class AuditLogService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    async getAuditLogs(filter = {}, options = {}) {
        return await this.repository.getLogs(filter, options);
    }
}

module.exports = AuditLogService;
