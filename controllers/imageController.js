'use strict';
import * as model from '../models/imageModel.js';

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

export { getImagesList, getImageWithID, uploadImage };
