const express = require('express');
const { userController } = require('../bootstrap');
const { protect } = require('../middleware/auth');
const limiter = require('../middleware/rateLimit');

const router = express.Router();
console.log('User router created');

// Register a new user (public)
router.post('/register', limiter, userController.registerUser);

// Login user (public)
router.post('/login', limiter, userController.loginUser);

router.get('/:id', protect, userController.getUserById);
router.get('/', protect, userController.getAllUsers);
router.post('/assign-role', protect, userController.assignRole);

module.exports = router;
