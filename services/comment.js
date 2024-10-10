const BaseService = require('./baseService');
const fs = require('fs').promises;

class CommentService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    async addAttachmentToComment(commentId, attachments) {
        return await this.repository.addAttachments(commentId, attachments);
    }

    async deleteAttachment(commentId, attachmentId) {
        const comment = await this.repository.findById(commentId);
        if (!comment) {
            throw new Error('Comment not found');
        }

        const attachment = comment.attachments.id(attachmentId);
        if (!attachment) {
            throw new Error('Attachment not found');
        }

        await fs.unlink(attachment.filepath).catch(err => {
            console.error('Error deleting file:', err);
        });

        attachment.remove();
        return await comment.save();
    }
}

module.exports = CommentService;
