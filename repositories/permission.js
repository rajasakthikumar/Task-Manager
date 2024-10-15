const BaseRepository = require('./baseRepositoryWithSoftDelete');
const Permission = require('../models/permission');

class PermissionRepository extends BaseRepository {
    constructor() {
        super(Permission);
    }

    async findByName(name) {
        return await this.model.findOne({name});
    }
}

module.exports = PermissionRepository;