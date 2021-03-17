'use strict';

import express from 'express';
import { userAuth } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', userAuth);

export default router;
