const Permission = require('./models/permission');
const Role = require('./models/role');

const seedPermissionsAndRoles = async () => {
    // Define permissions
    const permissions = [
        { name: 'VIEW_TASKS', description: 'View all tasks' },
        { name: 'CREATE_TASK', description: 'Create new task' },
        { name: 'UPDATE_TASK', description: 'Update existing task' },
        { name: 'DELETE_TASK', description: 'Delete task' }
    ];

    // Seed permissions
    for (const permissionData of permissions) {
        const existingPermission = await Permission.findOne({ name: permissionData.name });
        if (!existingPermission) {
            await Permission.create(permissionData);
        }
    }

    // Define roles and map permissions to roles
    const roles = [
        { name: 'admin', permissions: ['VIEW_TASKS', 'CREATE_TASK', 'UPDATE_TASK', 'DELETE_TASK'] },
        { name: 'user', permissions: ['VIEW_TASKS'] }
    ];

    // Seed roles
    for (const roleData of roles) {
        const existingRole = await Role.findOne({ name: roleData.name });
        if (!existingRole) {
            const rolePermissions = await Permission.find({ name: { $in: roleData.permissions } });
            const newRole = new Role({ name: roleData.name, permissions: rolePermissions.map(p => p._id) });
            await newRole.save();
        }
    }



    console.log('Permissions and roles seeded successfully.');
};


module.exports = seedPermissionsAndRoles;
