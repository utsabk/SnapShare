'use strict';
import express from 'express';
import * as controller from '../controllers/imageController.js';
import { uploadDestPost } from '../utils/uploadDest.js';
import checkAuth from '../utils/checkAuth.js'

const router = express.Router();

router
  .route('/')
  .get(controller.getImagesList) // get all images
  .post(checkAuth, uploadDestPost.single('image'), controller.uploadImage); // create a post

router
  .route('/:id',checkAuth)
  .get(controller.getImageWithID) // get a image with ID
  .delete(controller.deletePost); // delete a post

router.get('/user/:userId', controller.getTotalPostsByUser);

export default router;
