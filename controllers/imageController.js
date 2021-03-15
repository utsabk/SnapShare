'use strict';
import * as model from '../models/imageModel.js';

const getImagesList = async (req, res) => {
  const posts = await model.getAllImages();

  res.json(posts);
};

export { getImagesList };
