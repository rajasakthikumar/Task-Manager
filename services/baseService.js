const { model } = require("mongoose");

class BaseService {
    constructor(repository) {
        this.repository = repository;
    }

    create(data) {
       return this.repository.create(data);
    }

    insertMany(datas) {
        return this.repository.insertMany(datas);
    }

    findAll(filter,queryOptions) {
        return this.repository.findAll(filter,queryOptions);
    }

    findById(id,queryOptions) {
        return this.repository.findById(id,queryOptions)
    }

    deleteById(id) {
        return this.repository.delete(id)
    }
}

module.exports = BaseService;