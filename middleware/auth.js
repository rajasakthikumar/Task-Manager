const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncHandler = require('./asynchandler');

// Protect routes - ensure user is authenticated
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({
            message: 'Not authorized, no token'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                message: 'Not authorized, user not found'
            });
        }

        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({
            message: 'Not authorized, token failed'
        });
    }
});

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.roles.some(role => allowedRoles.includes(role))) {
            throw new Error('Forbidden: You do not have access to this resource');
        }
        next();
    };
};

module.exports = { protect, authorize };
