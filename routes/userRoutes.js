'use strict';
import express from 'express';
import * as controller from '../controllers/userController.js';
import { uploadDestProfile } from '../utils/uploadDest.js';
import { validationRules, validate } from '../utils/validator.js';


const router = express.Router();

router.get('/:id', controller.userWithId);

// add a profile picture
router.post(
  '/profile',
  uploadDestProfile.single('profile'),
  controller.uploadProfile
);

router.put('/:id', validationRules(), validate, controller.updateUserData);


export default router;
