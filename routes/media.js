'use strict';
import express from 'express';
const router = express.Router();


// get all images
router.get('/images', (req,res) => {
    res.send('You\'ll get all the images here.')
});
// create medium image
router.post('/upload', (req,res) => {
    res.send('You can POST images here.')
});


export default router;
