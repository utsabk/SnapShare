'use strict';
import express from 'express';
import * as controller from '../controllers/imageController.js';
const router = express.Router();


// get all images
router.get('/', controller.getImagesList);

// create a post 
router.post('/upload', (req,res) => {
    res.send('You can POST images here.')
});


export default router;
