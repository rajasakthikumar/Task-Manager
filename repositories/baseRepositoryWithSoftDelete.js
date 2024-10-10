const BaseRepository = require('./baseRepository');

class BaseRepositoryWithSoftDelete extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async softDelete(id) {
        try {
            const doc = await this.model.findById(id);
            if (!doc) throw new Error(`${this.model.modelName} not found with id ${id}`);
            doc.isDeleted = true;
            doc.deletedDate = new Date();
            await doc.save();
            return doc;
        } catch (error) {
            throw new Error(`Error soft deleting ${this.model.modelName}: ${error.message}`);
        }
    }

    async restore(id) {
        try {
            const doc = await this.model.findById(id);
            if (!doc) throw new Error(`${this.model.modelName} not found with id ${id}`);
            doc.isDeleted = false;
            doc.deletedDate = null;
            await doc.save();
            return doc;
        } catch (error) {
            throw new Error(`Error restoring ${this.model.modelName}: ${error.message}`);
        }
    }

    async findAllDeleted() {
        try {
            const docs = await this.model.find({ isDeleted: true });
            return docs;
        } catch (error) {
            throw new Error(`Error fetching deleted ${this.model.modelName}s: ${error.message}`);
        }
    }
}

module.exports = BaseRepositoryWithSoftDelete;
