const express = require('express');
const CommentController = require('../controllers/comment');
const { protect } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

const router = express.Router();
const commentController = new CommentController();

router.post(
    '/tasks/:taskId/comments',
    protect,
    uploadMultiple,
    commentController.addComment
);

router.post(
    '/comments/:commentId/attachments',
    protect,
    uploadMultiple,
    commentController.addAttachmentsToComment
);

router.get(
    '/comments/:commentId/attachments/:attachmentId/download',
    protect,
    commentController.downloadAttachment
);

router.delete(
    '/comments/:commentId/attachments/:attachmentId',
    protect,
    commentController.deleteAttachment
);

module.exports = router;
