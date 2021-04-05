'use strict';

import express from 'express';
import { userLogin, userRegister } from '../controllers/authController.js';
import { validationRules, validate } from '../utils/validator.js';

const router = express.Router();

router.post('/login', userLogin);

// After adding a user to DB, it will call userLogin function
router.post('/register', validationRules(), validate, userRegister, userLogin);

export default router;
