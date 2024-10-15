const asyncHandler = require('../middleware/asynchandler');
const CustomError = require('../util/customError');

class RoleController {
    constructor(roleService) {
        this.roleService = roleService;
    }

    createRole = asyncHandler(async (req, res,next) => {
        const {role} = req.body;
        if(role == "president") {
            next(new CustomError("Cannot create this role",400));
        }
        console.log(req.body);
        let roles = await this.roleService.createRole(req.body);
        res.status(201).json(roles);
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
