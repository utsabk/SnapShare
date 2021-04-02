'use strict';
import express from 'express';
import * as controller from '../controllers/imageController.js';
import { uploadDestPost } from '../utils/uploadDest.js';
const router = express.Router();

router
  .route('/')
  .get(controller.getImagesList) // get all images
  .post(uploadDestPost.single('image'), controller.uploadImage); // create a post

router
  .route('/:id')
  .get(controller.getImageWithID) // get a image with ID
  .delete(controller.deletePost); // delete a post

export default router;
