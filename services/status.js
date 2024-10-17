const BaseService = require('./baseService');
const CustomError = require('../util/customError');

class StatusService extends BaseService {
    constructor(repository, auditLogService) {
        super(repository);
        this.auditLogService = auditLogService;
    }

    async getAllStatus() {
        return await this.repository.getAllStatus();
    }

    async getDeletedStatuses() {
        return await this.repository.findAllDeleted();
    }

    async findById(id) {
        const status = await this.repository.findById(id);
        if (!status) {
            throw new CustomError('Status not found', 404);
        }
        return status;
    }

    async createStatus(statusData, user) {
        const newStatus = await this.repository.createStatus(statusData);

        await this.auditLogService.create({
            action: 'Status Created',
            performedBy: user._id,
            entity: 'Status',
            entityId: newStatus._id,
            changes: { statusData },
        });

        return newStatus;
    }

    async deleteStatus(id, user) {
        const status = await this.repository.softDelete(id);
        if (!status) {
            throw new CustomError('Status not found', 404);
        }

        await this.auditLogService.create({
            action: 'Status Soft Deleted',
            performedBy: user._id,
            entity: 'Status',
            entityId: id,
        });

        return status;
    }

    async restoreStatus(id, user) {
        const status = await this.repository.restore(id);
        if (!status) {
            throw new CustomError('Status not found', 404);
        }

        await this.auditLogService.create({
            action: 'Status Restored',
            performedBy: user._id,
            entity: 'Status',
            entityId: id,
        });

        return status;
    }

    async hardDeleteStatus(id, user) {
        const status = await this.repository.delete(id);
        if (!status) {
            throw new CustomError('Status not found', 404);
        }

        await this.auditLogService.create({
            action: 'Status Permanently Deleted',
            performedBy: user._id,
            entity: 'Status',
            entityId: id,
        });

        return status;
    }

    async modifyStatus(id, statusData, user) {
        const status = await this.repository.update(id, statusData);
        if (!status) {
            throw new CustomError('Status not found', 404);
        }

        await this.auditLogService.create({
            action: 'Status Modified',
            performedBy: user._id,
            entity: 'Status',
            entityId: id,
            changes: statusData,
        });

        return status;
    }

    async addNextStatus(id, nextStatusId, user) {
        const status = await this.repository.findById(id);
        if (!status) {
            throw new CustomError('Status not found', 404);
        }

        status.nextStatuses.push(nextStatusId);
        await status.save();

        await this.auditLogService.create({
            action: 'Next Status Added',
            performedBy: user._id,
            entity: 'Status',
            entityId: id,
            changes: { nextStatusId },
        });

        return status;
    }

    async addPrevStatus(id, prevStatusId, user) {
        const status = await this.repository.findById(id);
        if (!status) {
            throw new CustomError('Status not found', 404);
        }

        status.prevStatuses.push(prevStatusId);
        await status.save();

        await this.auditLogService.create({
            action: 'Previous Status Added',
            performedBy: user._id,
            entity: 'Status',
            entityId: id,
            changes: { prevStatusId },
        });

        return status;
    }

    async validateTransition(currentStatusId, nextStatusId, user) {
        const currentStatus = await this.repository.findById(currentStatusId);
        if (!currentStatus) {
            throw new CustomError('Current status not found', 404);
        }

        const isValidTransition = currentStatus.nextStatuses.some(
            (status) => status.toString() === nextStatusId
        );

        if (!isValidTransition) {
            throw new CustomError('Invalid status transition', 400);
        }

        await this.auditLogService.create({
            action: 'Status Transition Validated',
            performedBy: user._id,
            entity: 'StatusTransition',
            entityId: `${currentStatusId}->${nextStatusId}`,
        });

        return true;
    }
}

module.exports = StatusService;
