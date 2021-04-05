import * as commentModel from '../models/commentModel.js';

const getAllComments = async (req, res) => {
  const comments = await commentModel.getCommentsList();
  res.json(comments);
};

const getCommentByImage = async (req, res) => {
  const imageId = req.params.id;
  const comments = await commentModel.getCommentsOfAnImage(imageId);
  // Rest in Object Destructuring to get all the properties except password
  const commentWithoutUserPW = comments.map(
    ({ password, ...comments }) => comments
  );
  res.json(commentWithoutUserPW);
};

const getCommentByUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const [totalComments] = await commentModel.getTotalCommentsByUser(id);
    res.json(totalComments);
  } catch (err) {
    console.log('Error get comments by user :-', err);
  }
};

const postComment = async (req, res, next) => {
  const params = [req.body.content, req.body.userId, req.body.imageId];
  try {
    const upload = await commentModel.postComment(params);
    res.send({ message: 'upload ok' }); 
  } catch (err) {
    console.log('Error', err);
  }
};


export {
  getAllComments,
  getCommentByImage,
  getCommentByUser,
  postComment,
};
