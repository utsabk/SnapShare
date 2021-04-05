import express from 'express';
import * as controller from '../controllers/commentController.js';

const router = express.Router();

router
  .route('/')
  .get(controller.getAllComments)
  .post(controller.postComment);

router.get('/:id', controller.getCommentByImage);
router.get('/user/:userId', controller.getCommentByUser);

export default router;
