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

export { getImagesList, getImageWithID };
