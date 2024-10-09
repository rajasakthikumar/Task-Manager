const asyncHandler = require('./asynchandler');

const permissionsCheck = requiredPermissions => {
    return asyncHandler(async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await req.user.populate('roles').execPopulate();
        const userPermissions = req.user.roles.flatMap(
            role => role.permissions
        );
        const hasPermission = requiredPermissions.every(permission =>
            userPermissions.includes(permission)
        );
        if (!hasPermission) {
            return res.status(403).json({
                message: 'Warning: you do not have the necessary permissions'
            });
        }
        next();
    });
};

module.exports = { permissionsCheck };
