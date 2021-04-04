'use strict';
import * as model from '../models/imageModel.js';

const getImagesList = async (req, res) => {
  const posts = await model.getAllImages();
  // Rest in Object Destructuring to get all the properties except password
  const postsWithoutPW = posts.map(({ password, ...post }) => post);
  res.json(postsWithoutPW);
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

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const del = await model.deleteImage(id);
    res.json({ status: 'sucessfully delete' });
  } catch (err) {
    console.log('Error deletePost:-', err);
  }
};

export { getImagesList, getImageWithID, uploadImage, deletePost };
