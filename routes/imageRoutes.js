'use strict';
import express from 'express';
import * as controller from '../controllers/imageController.js';
import { uploadDestPost } from '../utils/uploadDest.js';
const router = express.Router();

// get all images
router.get('/', controller.getImagesList);

// get a image with ID
router.get('/:id', controller.getImageWithID);

// create a post
router.post('/', uploadDestPost.single('image'), controller.uploadImage);

export default router;
