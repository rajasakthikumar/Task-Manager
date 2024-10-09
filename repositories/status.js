// repositories/statusRepository.js
const BaseRepositoryWithSoftDelete = require('./baseRepositoryWithSoftDelete');
const Status = require('../models/status');
const AuditLog = require('../models/auditLog');

class StatusRepository extends BaseRepositoryWithSoftDelete {
    constructor() {
        console.log("Status Repository created");
        super(Status);
    }

    async getAllStatus(userId) {
        // Assuming any authenticated user can view all statuses
        return await this.model.find({}).populate('nextStatuses').populate('prevStatuses');
    }

    async createStatus(statusData, userId) {
        const newStatus = await this.model.create(statusData);

        // Create audit log
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
        if (!status) throw new Error('Status not found');

        await this.softDelete(id);

        // Create audit log
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
        if (!status) throw new Error('Status not found');

        // Create audit log
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
        if (!status) throw new Error('Status not found');

        await this.delete(id);

        // Create audit log
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

        // Create audit log
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
        if (!status) throw new Error('Status not found');

        status.nextStatuses.push(nextStatusId);
        await status.save();

        // Create audit log
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
        if (!status) throw new Error('Status not found');

        status.prevStatuses.push(prevStatusId);
        await status.save();

        // Create audit log
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
        if (!currentStatus) throw new Error('Current status not found');

        if (!currentStatus.nextStatuses.includes(nextStatusId)) {
            throw new Error('Invalid status transition');
        }

        // Create audit log
        await AuditLog.create({
            action: 'Status Transition Validated',
            performedBy: userId,
            entity: 'StatusTransition',
            entityId: `${currentStatusId}->${nextStatusId}`,
            changes: {}
        });

        return true;
    }

    // Additional methods if needed
}

module.exports = StatusRepository;
