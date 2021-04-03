import express from 'express';
import * as controller from '../controllers/commentController.js';

const router = express.Router();

router.route('/')
.get(controller.getAllComments)
.post(controller.postComment, controller.addCommentCount)

router.get('/:id', controller.getCommentByImage);

export default router;
