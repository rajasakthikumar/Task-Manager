const BaseRepositorySoftDelete = require('./baseRepositoryWithSoftDelete');
const Status = require('../models/status');
const Log = require('../models/log');

class StatusRepository extends BaseRepositorySoftDelete {
    constructor() {
        console.log("Status Repository created");
        super(Status);
    }

    async getAllStatus(userId) {
        return await this.model.find({ user: userId, isDeleted: false });
    }

    async findById(id, userId) {
        const status = await this.model.findOne({ _id: id, user: userId, isDeleted: false });
        if (!status) throw new Error('Status not found or unauthorized');
        return status;
    }

    async createStatus(statusData, user) {
        const createdStatus = await this.model.create({
            ...statusData,
            user: user._id
        });

        await Log.create({
            action: 'Status Created',
            user: user._id,
            status: createdStatus._id
        });
        return createdStatus;
    }

    async deleteStatus(id, userId) {
        const status = await this.findById(id, userId);
        status.isDeleted = true;
        status.deletedDate = new Date();

        await Log.create({
            action: 'Status Soft Deleted',
            user: userId,
            status: status._id
        });

        return await status.save();
    }

    async restoreStatus(id, userId) {
        const status = await this.model.findOne({ _id: id, user: userId, isDeleted: true });
        if (!status) throw new Error('Status not found or unauthorized');

        status.isDeleted = false;
        status.deletedDate = null;

        await Log.create({
            action: 'Status Restored',
            user: userId,
            status: status._id
        });

        return await status.save();
    }

    async hardDeleteStatus(id, userId) {
        const status = await this.findById(id, userId);
        await Log.create({
            action: 'Status Permanently Deleted',
            user: userId,
            status: status._id
        });
        return await this.model.findByIdAndDelete(id);
    }

    async modifyStatus(id, statusData, userId) {
        const status = await this.findById(id, userId);

        Object.assign(status, statusData);

        await Log.create({
            action: 'Status Modified',
            user: userId,
            status: status._id
        });

        return await status.save();
    }

    async addNextStatus(id, newNextStatusId, userId) {
        const currentStatus = await this.findById(id, userId);
        const newNextStatus = await this.findById(newNextStatusId, userId);

        if (!currentStatus.nextStatus.includes(newNextStatus._id)) {
            currentStatus.nextStatus.push(newNextStatus._id);
        }

        await Log.create({
            action: 'Next Status Added',
            user: userId,
            status: currentStatus._id,
            nextStatus: newNextStatus._id
        });

        return await currentStatus.save();
    }

    async addPrevStatus(id, newPrevStatusId, userId) {
        const currentStatus = await this.findById(id, userId);
        const newPrevStatus = await this.findById(newPrevStatusId, userId);

        if (!currentStatus.previousStatus.includes(newPrevStatus._id)) {
            currentStatus.previousStatus.push(newPrevStatus._id);
        }

        await Log.create({
            action: 'Previous Status Added',
            user: userId,
            status: currentStatus._id,
            previousStatus: newPrevStatus._id
        });

        return await currentStatus.save();
    }

    async getDeletedStatuses(userId) {
        return await this.model.find({ user: userId, isDeleted: true });
    }

    async validateTransition(currentStatusId, nextStatusId, userId) {
        const currentStatus = await this.findById(currentStatusId, userId);
        const nextStatus = await this.findById(nextStatusId, userId);

        if (currentStatus.nextStatus.includes(nextStatus._id)) {
            return true;
        } else {
            throw new Error('Invalid status transition');
        }
    }
}

module.exports = StatusRepository;
