const asyncHandler = require('../middleware/asynchandler');
const CommentService = require('../services/comment');
const CommentRepository = require('../repositories/comment');
const path = require('path');
const fs = require('fs');

class CommentController {
    constructor() {
        const commentRepository = new CommentRepository();
        this.commentService = new CommentService(commentRepository);
    }

    addComment = asyncHandler(async (req, res) => {
        const { taskId } = req.params;
        const { text } = req.body;

        const attachments = req.files
            ? req.files.map(file => ({
                  filename: file.filename,
                  filepath: file.path
              }))
            : [];

        const newComment = await this.commentService.create({
            text,
            createdBy: req.user._id,
            task: taskId,
            attachments
        });

        res.status(201).json(newComment);
    });

    addAttachmentsToComment = asyncHandler(async (req, res) => {
        const { commentId } = req.params;

        const attachments = req.files.map(file => ({
            filename: file.filename,
            filepath: file.path
        }));

        const updatedComment = await this.commentService.addAttachmentToComment(
            commentId,
            attachments
        );

        res.status(200).json(updatedComment);
    });

    downloadAttachment = asyncHandler(async (req, res) => {
        const { commentId, attachmentId } = req.params;
        const comment = await this.commentService.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const attachment = comment.attachments.id(attachmentId);
        if (!attachment) {
            return res.status(404).json({ message: 'Attachment not found' });
        }

        const filePath = path.resolve(attachment.filepath);
        res.download(filePath, attachment.filename);
    });

    deleteAttachment = asyncHandler(async (req, res) => {
        const { commentId, attachmentId } = req.params;
        const updatedComment = await this.commentService.deleteAttachment(
            commentId,
            attachmentId
        );

        res.status(200).json(updatedComment);
    });
}

module.exports = CommentController;
