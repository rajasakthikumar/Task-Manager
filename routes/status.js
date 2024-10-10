const express = require('express');
const { statusController } = require('../bootstrap');
const { protect } = require('../middleware/auth');
const router = express.Router();

console.log('Status router created in the routes');

router.get('/', protect, statusController.getAllStatus);
router.get('/deleted', protect, statusController.getDeletedStatuses);
router.get('/:id', protect, statusController.findStatusById);
router.post('/', protect, statusController.createStatus);
router.delete('/:id', protect, statusController.deleteStatus);
router.post('/:id/restore', protect, statusController.restoreStatus);
router.delete('/:id/hard-delete', protect, statusController.hardDeleteStatus);
router.put('/:id', protect, statusController.modifyStatus);
router.post('/:id/next-status', protect, statusController.addNextStatus);
router.post('/:id/prev-status', protect, statusController.addPrevStatus);
router.get('/validate-transition/:currentStatusId/:nextStatusId', protect, statusController.validateTransition);

module.exports = router;
