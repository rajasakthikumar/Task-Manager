// services/commentService.js
const BaseService = require('./baseService');

class CommentService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    async addAttachmentToComment(commentId, attachments, userId) {
        const updatedComment = await this.repository.addAttachmentToComment(commentId, attachments);
        return updatedComment;
    }
}

module.exports = CommentService;
