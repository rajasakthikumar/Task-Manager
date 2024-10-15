const BaseService = require('./baseService');
const CustomError = require('../util/customError');

class RoleService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    async createRole(roleData) {
        const existingRole = await this.repository.findByName(roleData.name);
        console.log('Creating role with data:', roleData);
        
        if (existingRole) {
            throw new CustomError('Role already exists');
        }
        return await this.repository.create(roleData);
    }

    async getAllRoles() {
        return await this.repository.findAll();
    }

    async getRoleByName(roleName) {
        return await this.repository.findByName(roleName);
    }

    async getRoleById(id) {
        return await this.repository.findById(id);
    }
}

module.exports = RoleService;
