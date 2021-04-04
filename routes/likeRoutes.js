'use strict';
import express from 'express';
import * as likeController from '../controllers/likeController.js';

const router = express.Router();

router.get('/:imageId', likeController.getLikes);
router.post('/status/',likeController.likeStatus);
router.post('/add/', likeController.addALike);
router.delete('/remove/', likeController.deleteLike);

export default router;
