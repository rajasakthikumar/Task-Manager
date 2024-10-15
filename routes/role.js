const express = require('express');
const { roleController } = require('../bootstrap');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', roleController.createRole);
router.get('/', protect, roleController.getAllRoles);
router.get('/:id', protect, roleController.getRoleById);

module.exports = router;
