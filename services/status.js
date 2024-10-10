const BaseService = require('./baseService');

class StatusService extends BaseService {
    constructor(repository, auditLogRepository) {
        super(repository);
        this.auditLogRepository = auditLogRepository;
    }

    async getAllStatus(user) {
        return await this.repository.getAllStatus(user._id);
    }

    async getDeletedStatuses(user) {
        return await this.repository.findAllDeleted();
    }

    async createStatus(statusData, user) {
        return await this.repository.createStatus(statusData, user._id);
    }

    async deleteStatus(id, user) {
        return await this.repository.deleteStatus(id, user._id);
    }

    async restoreStatus(id, user) {
        return await this.repository.restoreStatus(id, user._id);
    }

    async hardDeleteStatus(id, user) {
        return await this.repository.hardDeleteStatus(id, user._id);
    }

    async modifyStatus(id, statusData, user) {
        return await this.repository.modifyStatus(id, statusData, user._id);
    }

    async addNextStatus(id, nextStatusId, user) {
        return await this.repository.addNextStatus(id, nextStatusId, user._id);
    }

    async addPrevStatus(id, prevStatusId, user) {
        return await this.repository.addPrevStatus(id, prevStatusId, user._id);
    }

    async validateTransition(currentStatusId, nextStatusId, user) {
        return await this.repository.validateTransition(currentStatusId, nextStatusId, user._id);
    }
}

module.exports = StatusService;
