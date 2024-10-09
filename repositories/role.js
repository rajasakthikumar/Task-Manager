const BaseService = require('./baseService');

class RoleService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    async createRole(roleData) {
        const existingRole = await this.repository.findByName(roleData.name);
        if (existingRole) {
            throw new Error('Role already exists');
        }
        return await this.repository.create(roleData);
    }
}

module.exports = RoleService;
