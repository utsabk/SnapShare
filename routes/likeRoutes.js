'use strict';
import express from 'express';
import * as controller from '../controllers/likeController.js';
import checkAuth from '../utils/checkAuth.js'

const router = express.Router();

router.get('/:imageId', controller.getLikesByImage);
router.get('/user/:userId', controller.getLikesByUser);
router.post('/status/',checkAuth, controller.likeStatus);
router.post('/add/',checkAuth, controller.addALike);
router.delete('/remove/',checkAuth, controller.deleteLike);

export default router;
