// services/baseService.js
class BaseService {
    constructor(repository) {
        this.repository = repository;
    }

    async create(data) {
        return await this.repository.create(data);
    }

    async findAll(filter = {}, options = {}) {
        return await this.repository.findAll(filter, options);
    }

    async findById(id, populate = '') {
        return await this.repository.findById(id, populate);
    }

    async update(id, data) {
        return await this.repository.update(id, data);
    }

    async delete(id) {
        return await this.repository.delete(id);
    }
}

module.exports = BaseService;
