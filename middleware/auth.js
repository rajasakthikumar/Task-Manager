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
        req.user = await User.findById(decoded.id)
        .select('-password')
        .populate({
            path: 'roles',
            populate: {
                path: 'permissions',
                model: 'Permission'
            }
        });
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

const authorize = (...requiredPermissions) => {
    return asyncHandler(async (req, res, next) => {
        const userPermissions = req.user.roles.flatMap(role => role.permissions.map(p => p.name));
        const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));
        if (!hasPermission) {
            return res.status(403).json({ message: 'You do not have  required permissions' });
        }
        next();
    });
};

module.exports = { protect, authorize };
