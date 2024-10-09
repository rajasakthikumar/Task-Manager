const asyncHandler = require('../middleware/asynchandler');

class RoleController {
    constructor(roleService) {
        this.roleService = roleService;
    }

    createRole = asyncHandler(async (req, res) => {
        const role = await this.roleService.createRole(req.body);
        res.status(201).json(role);
    });

    getAllRoles = asyncHandler(async (req, res) => {
        const roles = await this.roleService.getAllRoles();
        res.status(200).json(roles);
    });

    getRoleById = asyncHandler(async (req, res) => {
        const role = await this.roleService.getRoleById(req.params.id);
        res.status(200).json(role);
    });
}

module.exports = RoleController;
