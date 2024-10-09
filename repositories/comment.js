const Comment = require('../models/comment');
const BaseRepository = require('./baseRepository');

class CommentRepository extends BaseRepository {
    constructor() {
        super(Comment);
    }

    async addAttachments(commentId, attachments) {
        const comment = await this.findById(commentId);
        if (!comment) {
            throw new Error('Comment not found');
        }

        comment.attachments.push(...attachments);
        return await comment.save();
    }
}

module.exports = CommentRepository;
