const express = require('express');
const { statusController } = require('../bootstrap');
const { protect } = require('../middleware/auth');
const router = express.Router();

console.log("Status router created in the routes");
console.log(statusController);

// Get all statuses (protected)
router.get('/status', protect, (req, res, next) => {
    statusController.getAllStatus(req, res, next);
});

// Create a new status (protected)
router.post('/status', protect, (req, res, next) => {
    statusController.createStatus(req, res, next);
});

// Delete a status by ID (protected)
router.delete('/status/:id', protect, (req, res, next) => {
    statusController.deleteStatus(req, res, next);
});

// Update/modify a status by ID (protected)
router.put('/status/:id', protect, (req, res, next) => {
    statusController.modifyStatus(req, res, next);
});

// Delete status by ID (alternative endpoint, protected)
router.delete('/status/delete/:id', protect, (req, res, next) => {
    statusController.deleteById(req, res, next);
});

// Add a status to the nextStatus array (protected)
router.post('/status/n/:id/:nextStatusId', protect, (req, res, next) => {
    statusController.addNextStatus(req, res, next);
});

// Add a status to the previousStatus array (protected)
router.post('/status/p/:id/:prevStatusId', protect, (req, res, next) => {
    statusController.addPrevStatus(req, res, next);
});

// Find status by ID (protected)
router.get('/status/:id', protect, (req, res, next) => {
    statusController.findStatusById(req, res, next);
});

module.exports = router;