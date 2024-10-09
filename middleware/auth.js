const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncHandler = require('./asynchandler');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
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
    return asyncHandler(async (req, res, next) => {
        if (!req.user) {
            throw new Error('Not authorized');
        }
        await req.user.populate('roles').execPopulate();
        const userRoles = req.user.roles.map(role => role.name);
        const hasRole = userRoles.some(role =>
            allowedRoles.includes(role)
        );
        if (!hasRole) {
            return res.status(403).json({
                message: 'Forbidden: You do not have access to this resource'
            });
        }
        next();
    });
};

module.exports = { protect, authorize };
