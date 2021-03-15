'use strict';
import * as model from '../models/postModel.js';

const getPostList = async (req, res) => {
  const posts = await model.getAllPosts();

  res.json(posts);
};

export { getPostList };
