const express = require('express');
const { userController } = require('../bootstrap');
const { protect } = require('../middleware/auth');
const limiter = require('../middleware/rateLimit');

const router = express.Router();
console.log("User router created");

// Register a new user (public)
router.post('/register',limiter, (req, res, next) => {
    userController.registerUser(req, res, next);
});

// Login user (public)
router.post('/login', limiter, (req, res, next) => {
    userController.loginUser(req, res, next);
});

router.get('/user/:id', protect, (req, res, next) => {
    userController.getUserById(req, res, next);
});

module.exports = router;
