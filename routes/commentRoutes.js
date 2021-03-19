import express from 'express';
import * as controller from '../controllers/commentController.js';

const router = express.Router();

router.get('/', controller.getAllComments);
router.get('/:id', controller.getCommentByImage);
router.post('/', controller.postComment)

export default router;
