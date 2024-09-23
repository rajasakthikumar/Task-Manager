const asyncHandler = require('../middleware/asynchandler');


class StatusController {
    constructor(service) {
        this.service = service;
    }

    getAllStatus = asyncHandler(async (req, res) => {
        const statuses = await this.service.getAllStatus(req.user);
        res.status(200).json(statuses);
    });

    createStatus = asyncHandler(async (req, res) => {
        const status = await this.service.createStatus(req.body, req.user);
        res.status(201).json(status);
    });

    deleteStatus = asyncHandler(async (req, res) => {
        const id = req.params.id;
        const deletedStatus = await this.service.deleteStatus(id, req.user);
        res.status(200).json(deletedStatus);
    });

    modifyStatus = asyncHandler(async (req, res) => {
        const id = req.params.id;
        const bodyToModify = req.body;
        const modifiedStatus = await this.service.modifyStatus(id, bodyToModify, req.user);
        res.status(200).json(modifiedStatus);
    });

    deleteById = asyncHandler(async (req, res) => {
        const id = req.params.id;
        const deletedStatus = await this.service.deleteStatus(id, req.user);
        res.status(200).json(deletedStatus);
    });

    addNextStatus = asyncHandler(async (req, res) => {
        const { id, nextStatusId } = req.params;
        const status = await this.service.addNextStatus(id, nextStatusId, req.user);
        res.status(200).json(status);
    });

    addPrevStatus = asyncHandler(async (req, res) => {
        const { id, prevStatusId } = req.params;
        const status = await this.service.addPrevStatus(id, prevStatusId, req.user);
        res.status(200).json(status);
    });

    findStatusById = asyncHandler(async (req, res) => {
        const id = req.params.id;
        const status = await this.service.findById(id, req.user);
        res.status(200).json(status);
    });
}


module.exports = StatusController;