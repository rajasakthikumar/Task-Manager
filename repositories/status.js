const BaseRepositorySoftDelete = require('./baseRepositoryWithSoftDelete');
const Status = require('../models/status');
const Log = require('../models/log');
class StatusRepository extends BaseRepositorySoftDelete {
    constructor() {
        console.log("Status Repository created");
        super(Status);
    }

    async getAllStatus(userId) {
        return await this.model.find({user:userId});
    }

    async createStatus(status, user) {
        const createdStatus = await this.model.create({
            ...status,
            user: user._id
        })

        await Log.create({
            action:'Ststus Created',
            user: user._id,
            status:createdStatus._id
        })
        return createdStatus
    }

    async deleteStatus(id) {
        return await this.model.findByIdAndDelete(id);
    }

    async modifyStatus(id, status) {
        return await this.model.findByIdAndUpdate(id, status, { new: true });
    }

    async addNextStatus(id, newNextStatusId) {
        const currentStatus = await this.model.findById(id);
        const newNextStatus = await this.model.findById(newNextStatusId);
        currentStatus.nextStatus.push(newNextStatus._id);
        return currentStatus.save();
    }

    async addPrevStatus(id, newPrevStatusId) {
        const currentStatus = await this.model.findById(id);
        const newPrevStatus = await this.model.findById(newPrevStatusId);
        currentStatus.previousStatus.push(newPrevStatus._id);
        return await currentStatus.save();
    }

    async findById(id) {
        return await this.model.findById(id);
    }
}

module.exports = StatusRepository;
