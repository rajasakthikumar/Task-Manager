const asyncHandler = require('../middleware/asynchandler');

class StatusController {
    constructor(service) {
        this.service = service;
    }

    getAllStatus = asyncHandler(async (req, res) => {
        const statuses = await this.service.getAllStatus(req.user);
        res.status(200).json(statuses);
    });

    getDeletedStatuses = asyncHandler(async (req, res) => {
        const statuses = await this.service.getDeletedStatuses(req.user);
        res.status(200).json(statuses);
    });

    findStatusById = asyncHandler(async (req, res) => {
        const id = req.params.id;
        const status = await this.service.findById(id, req.user);
        res.status(200).json(status);
    });

    createStatus = asyncHandler(async (req, res) => {
        const status = await this.service.createStatus(
            req.body,
            req.user
        );
        res.status(201).json(status);
    });

    deleteStatus = asyncHandler(async (req, res) => {
        const id = req.params.id;
        await this.service.deleteStatus(id, req.user);
        res.status(200).json({
            message: 'Status soft deleted successfully'
        });
    });

    restoreStatus = asyncHandler(async (req, res) => {
        const id = req.params.id;
        const restoredStatus = await this.service.restoreStatus(
            id,
            req.user
        );
        res.status(200).json({
            message: 'Status restored successfully',
            restoredStatus
        });
    });

    hardDeleteStatus = asyncHandler(async (req, res) => {
        const id = req.params.id;
        await this.service.hardDeleteStatus(id, req.user);
        res.status(200).json({
            message: 'Status permanently deleted successfully'
        });
    });

    modifyStatus = asyncHandler(async (req, res) => {
        const id = req.params.id;
        const bodyToModify = req.body;
        const modifiedStatus = await this.service.modifyStatus(
            id,
            bodyToModify,
            req.user
        );
        res.status(200).json(modifiedStatus);
    });

    addNextStatus = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { nextStatusId } = req.body;
        const status = await this.service.addNextStatus(
            id,
            nextStatusId,
            req.user
        );
        res.status(200).json(status);
    });

    addPrevStatus = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { prevStatusId } = req.body;
        const status = await this.service.addPrevStatus(
            id,
            prevStatusId,
            req.user
        );
        res.status(200).json(status);
    });

    validateTransition = asyncHandler(async (req, res) => {
        const { currentStatusId, nextStatusId } = req.params;
        await this.service.validateTransition(
            currentStatusId,
            nextStatusId,
            req.user
        );
        res.status(200).json({ message: 'Status transition is valid' });
    });
}

module.exports = StatusController;
