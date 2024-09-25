// routes/statusRoutes.js
const express = require('express');
const { statusController } = require('../bootstrap');
const { protect } = require('../middleware/auth');
const router = express.Router();

console.log("Status router created in the routes");

router.get('/status', protect, (req, res, next) => {
    statusController.getAllStatus(req, res, next);
});

router.get('/status/deleted', protect, (req, res, next) => {
    statusController.getDeletedStatuses(req, res, next);
});

router.get('/status/:id', protect, (req, res, next) => {
    statusController.findStatusById(req, res, next);
});

router.post('/status', protect, (req, res, next) => {
    statusController.createStatus(req, res, next);
});

router.delete('/status/:id', protect, (req, res, next) => {
    statusController.deleteStatus(req, res, next);
});

router.post('/status/:id/restore', protect, (req, res, next) => {
    statusController.restoreStatus(req, res, next);
});

router.delete('/status/:id/hard-delete', protect, (req, res, next) => {
    statusController.hardDeleteStatus(req, res, next);
});

router.put('/status/:id', protect, (req, res, next) => {
    statusController.modifyStatus(req, res, next);
});

router.post('/status/:id/next-status', protect, (req, res, next) => {
    statusController.addNextStatus(req, res, next);
});

router.post('/status/:id/prev-status', protect, (req, res, next) => {
    statusController.addPrevStatus(req, res, next);
});

router.get('/status/validate-transition/:currentStatusId/:nextStatusId', protect, (req, res, next) => {
    statusController.validateTransition(req, res, next);
});

module.exports = router;
