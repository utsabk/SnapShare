import * as commentModel from '../models/commentModel.js';

const getAllComments = async (req, res) => {
  const comments = await commentModel.getCommentsList();
  res.json(comments);
};

const getCommentByImage = async (req, res) => {
  const imageId = req.params.id;
  const comments = await commentModel.getCommentsOfAnImage(imageId);
  res.json(comments);
};

const postComment = async (req, res) => {
  const params = [req.body.content, req.body.userId, req.body.imageId];
  const upload = await commentModel.postComment(params);
  res.send({ message: 'upload ok' });
};

export { getAllComments, getCommentByImage, postComment };
