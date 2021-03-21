'use strict';
import multer from 'multer';
import * as model from '../models/imageModel.js';

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, './public/uploads/');
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').slice(-1);
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});
const uploadDest = multer({ storage: storage });

const getImagesList = async (req, res) => {
  const posts = await model.getAllImages();

  res.json(posts);
};

const getImageWithID = async (req, res) => {
  const id = req.params.id;
  const image = await model.getImageById(id);
  res.json(image);
};

const uploadImage = async (req, res) => {
  try {
    const data = [req.file.filename, req.body.ownerId];
    const upload = await model.postImage(data);
    res.send({ status: 'insert ok' });
  } catch (err) {
    console.log('Error uploadImage:-', err);
  }
};

export { getImagesList, getImageWithID, uploadDest, uploadImage };
