// repositories/statusRepository.js
const BaseRepositoryWithSoftDelete = require('./baseRepositoryWithSoftDelete');
const Status = require('../models/status');
const AuditLog = require('../models/auditLog');
const CustomError = require('../util/customError')

class StatusRepository extends BaseRepositoryWithSoftDelete {
    constructor() {
        console.log("Status Repository created");
        super(Status);
    }

    async getAllStatus(userId) {
        return await this.model.find({}).populate('nextStatuses').populate('prevStatuses');
    }

    async createStatus(statusData, userId) {
        const newStatus = await this.model.create(statusData);

        await AuditLog.create({
            action: 'Status Created',
            performedBy: userId,
            entity: 'Status',
            entityId: newStatus._id,
            changes: { statusData }
        });

        return newStatus;
    }

    async deleteStatus(id, userId) {
        const status = await this.findById(id);
        if (!status) throw new CustomError('Status not found');

        await this.softDelete(id);

        await AuditLog.create({
            action: 'Status Soft Deleted',
            performedBy: userId,
            entity: 'Status',
            entityId: id
        });

        return status;
    }

    async restoreStatus(id, userId) {
        const status = await this.restore(id);
        if (!status) throw new CustomError('Status not found');

        await AuditLog.create({
            action: 'Status Restored',
            performedBy: userId,
            entity: 'Status',
            entityId: id
        });

        return status;
    }

    async hardDeleteStatus(id, userId) {
        const status = await this.findById(id);
        if (!status) throw new CustomError('Status not found');

        await this.delete(id);

        await AuditLog.create({
            action: 'Status Permanently Deleted',
            performedBy: userId,
            entity: 'Status',
            entityId: id
        });

        return status;
    }

    async modifyStatus(id, statusData, userId) {
        const status = await this.update(id, statusData);

        await AuditLog.create({
            action: 'Status Modified',
            performedBy: userId,
            entity: 'Status',
            entityId: id,
            changes: statusData
        });

        return status;
    }

    async addNextStatus(id, nextStatusId, userId) {
        const status = await this.findById(id);
        if (!status) throw new CustomError('Status not found');

        status.nextStatuses.push(nextStatusId);
        await status.save();

        await AuditLog.create({
            action: 'Next Status Added',
            performedBy: userId,
            entity: 'Status',
            entityId: id,
            changes: { nextStatusId }
        });

        return status;
    }

    async addPrevStatus(id, prevStatusId, userId) {
        const status = await this.findById(id);
        if (!status) throw new CustomError('Status not found');

        status.prevStatuses.push(prevStatusId);
        await status.save();

        await AuditLog.create({
            action: 'Previous Status Added',
            performedBy: userId,
            entity: 'Status',
            entityId: id,
            changes: { prevStatusId }
        });

        return status;
    }

    async validateTransition(currentStatusId, nextStatusId, userId) {
        const currentStatus = await this.findById(currentStatusId);
        if (!currentStatus) throw new CustomError('Current status not found');

        if (!currentStatus.nextStatuses.includes(nextStatusId)) {
            throw new CustomError('Invalid status transition');
        }

        await AuditLog.create({
            action: 'Status Transition Validated',
            performedBy: userId,
            entity: 'StatusTransition',
            entityId: `${currentStatusId}->${nextStatusId}`,
            changes: {}
        });

        return true;
    }

}

module.exports = StatusRepository;
