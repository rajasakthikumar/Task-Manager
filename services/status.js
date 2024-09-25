// services/statusService.js
const BaseService = require('./baseService');

class StatusService extends BaseService {
    constructor(repository) {
        console.log("Status Service created");
        super(repository);
    }

    getAllStatus(user) {
        return this.repository.getAllStatus(user._id);
    }

    getDeletedStatuses(user) {
        return this.repository.getDeletedStatuses(user._id);
    }

    findById(id, user) {
        return this.repository.findById(id, user._id);
    }

    createStatus(status, user) {
        return this.repository.createStatus(status, user);
    }

    deleteStatus(id, user) {
        return this.repository.deleteStatus(id, user._id);
    }

    restoreStatus(id, user) {
        return this.repository.restoreStatus(id, user._id);
    }

    hardDeleteStatus(id, user) {
        return this.repository.hardDeleteStatus(id, user._id);
    }

    modifyStatus(id, statusData, user) {
        return this.repository.modifyStatus(id, statusData, user._id);
    }

    addNextStatus(id, nextStatusId, user) {
        return this.repository.addNextStatus(id, nextStatusId, user._id);
    }

    addPrevStatus(id, prevStatusId, user) {
        return this.repository.addPrevStatus(id, prevStatusId, user._id);
    }

    validateTransition(currentStatusId, nextStatusId, user) {
        return this.repository.validateTransition(currentStatusId, nextStatusId, user._id);
    }
}

module.exports = StatusService;
