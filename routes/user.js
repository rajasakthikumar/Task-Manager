const express = require('express');
const { userController } = require('../bootstrap');
const { protect } = require('../middleware/auth');
const limiter = require('../middleware/rateLimit');

const router = express.Router();
console.log("User router created");

// Register a new user (public)
router.post('/register',limiter, (req, res, next) => {
    console.log('req.body', req.body);
    userController.registerUser(req, res, next);
});

// Login user (public)
router.post('/login', limiter, (req, res, next) => {
    userController.loginUser(req, res, next);
});

router.get('/:id', protect, (req, res, next) => {
    userController.getUserById(req, res, next);
});

router.get('/', protect, (req, res, next) => {
    userController.getAllUsers(req, res, next);
});

router.post('/assign-role', protect, (req, res, next) => {
    userController.assignRole(req, res, next);
});

module.exports = router;
