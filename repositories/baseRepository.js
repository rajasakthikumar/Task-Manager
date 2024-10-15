const CustomError = require("../util/customError");

class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            const doc = await this.model.create(data);
            return doc;
        } catch (error) {
            throw new CustomError(
                `Error creating ${this.model.modelName}: ${error.message}`
            );
        }
    }

    async findAll(filter = {}, options = {}) {
        try {
            const docs = await this.model
                .find(filter)
                .skip(options.skip || 0)
                .limit(options.limit || 100)
                .sort(options.sort || { createdAt: -1 });
            return docs;
        } catch (error) {
            throw new CustomError(
                `Error fetching ${this.model.modelName}s: ${error.message}`
            );
        }
    }

    async findById(id, populate = '') {
        console.log('@!@!@!@! reached bas repository');
        try {
            const doc = await this.model.findById(id).populate(populate);
            return doc;
        } catch (error) {
            throw new CustomError(
                `${this.model.modelName} not found with id ${id}`
            );
        }
    }

    async update(id, data) {
        try {
            const updatedDoc = await this.model.findByIdAndUpdate(
              id,
                data,
                { new: true, runValidators: true }
            );
            return updatedDoc;
        } catch (error) {
            throw new Error(
                `Error updating ${this.model.modelName}: ${error.message}`
            );
        }
    }

    async delete(id) {
        try {
            await this.model.findByIdAndDelete(id);
            return true;
        } catch (error) {
            throw new Error(
                `Error deleting ${this.model.modelName}: ${error.message}`
            );
        }
    }
}

module.exports = BaseRepository;
