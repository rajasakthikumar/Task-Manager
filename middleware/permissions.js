const asyncHandler = require('./asynchandler');
const User = require('../models/user');

const permissionsCheck = (requiredPermissions) => {
    return asyncHandler(async (req, res, next) => {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('roles');

        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        const userPermissions = user.roles.flatMap(role => role.permissions);
        const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));
        
        if (!hasPermission) {
            return res.status(403).json({ message: 'Forbidden: You do not have the necessary permissions' });
        }

        next();
    });
};

module.exports = { permissionsCheck };
