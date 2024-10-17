const BaseRepositoryWithSoftDelete = require('./baseRepositoryWithSoftDelete');
const Status = require('../models/status');
const CustomError = require('../util/customError');

class StatusRepository extends BaseRepositoryWithSoftDelete {
    constructor() {
        super(Status);
    }

    async getAllStatus() {
        try {
            return await this.model.find({ isDeleted: false })
                .populate('nextStatuses')
                .populate('prevStatuses');
        } catch (error) {
            throw new CustomError(`Error fetching statuses: ${error.message}`);
        }
    }

    async createStatus(statusData) {
        try {
            const newStatus = await this.model.create(statusData);
            return newStatus;
        } catch (error) {
            throw new CustomError(`Error creating status: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const status = await this.model.findById(id)
                .populate('nextStatuses')
                .populate('prevStatuses');

            if (!status) {
                throw new CustomError('Status not found', 404);
            }

            return status;
        } catch (error) {
            throw new CustomError(`Error finding status by ID: ${error.message}`);
        }
    }

    async updateStatus(id, statusData) {
        try {
            const updatedStatus = await this.model.findByIdAndUpdate(
                id,
                statusData,
                { new: true, runValidators: true }
            ).populate('nextStatuses').populate('prevStatuses');

            if (!updatedStatus) {
                throw new CustomError('Status not found', 404);
            }

            return updatedStatus;
        } catch (error) {
            throw new CustomError(`Error updating status: ${error.message}`);
        }
    }

    async addNextStatus(id, nextStatusId) {
        try {
            const status = await this.findById(id);
            if (!status) {
                throw new CustomError('Status not found', 404);
            }

            if (!status.nextStatuses.includes(nextStatusId)) {
                status.nextStatuses.push(nextStatusId);
                await status.save();
            }

            return status;
        } catch (error) {
            throw new CustomError(`Error adding next status: ${error.message}`);
        }
    }

    async addPrevStatus(id, prevStatusId) {
        try {
            const status = await this.findById(id);
            if (!status) {
                throw new CustomError('Status not found', 404);
            }

            if (!status.prevStatuses.includes(prevStatusId)) {
                status.prevStatuses.push(prevStatusId);
                await status.save();
            }

            return status;
        } catch (error) {
            throw new CustomError(`Error adding previous status: ${error.message}`);
        }
    }

    async validateTransition(currentStatusId, nextStatusId) {
        try {
            const currentStatus = await this.findById(currentStatusId);
            if (!currentStatus) {
                throw new CustomError('Current status not found', 404);
            }

            const isValidTransition = currentStatus.nextStatuses.some(
                (status) => status._id.toString() === nextStatusId
            );

            return isValidTransition;
        } catch (error) {
            throw new CustomError(`Error validating status transition: ${error.message}`);
        }
    }
}

module.exports = StatusRepository;
