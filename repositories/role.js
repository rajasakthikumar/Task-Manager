const BaseRepository = require('./baseRepository');
const Role = require('../models/role');

class RoleRepository extends BaseRepository {
    constructor() {
        super(Role);
    }

    async findByName(name) {
        return await this.model.findOne({ name });
    }

    async findById(id) {
        console.log("@!@!@!@! Controle reached here");
        return await this.model.findById(id);
    }

}

module.exports = RoleRepository;
