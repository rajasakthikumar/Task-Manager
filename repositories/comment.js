const Comment = require('../models/comment');
const BaseRepository = require('./baseRepository');
const CustomError = require('../util/customError')

class CommentRepository extends BaseRepository {
    constructor() {
        super(Comment);
    }

    async addAttachments(commentId, attachments) {
        const comment = await this.findById(commentId);
        if (!comment) {
            throw new CustomError('Comment not found');
        }

        comment.attachments.push(...attachments);
        return await comment.save();
    }
}

module.exports = CommentRepository;
