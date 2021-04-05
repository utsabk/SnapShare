'use strict';
import * as model from '../models/likeModel.js';

const getLikesByImage = async (req, res) => {
  try {
    const id = req.params.imageId;
    const [totalLikes] = await model.getTotalLikesByImage(id);
    res.json(totalLikes);
  } catch (err) {
    console.log('Error get likes by image :-', err);
  }
};

const getLikesByUser = async (req, res) => {
    try {
      const id = req.params.userId;
      const [totalLikes] = await model.getTotalLikesByUser(id);
      res.json(totalLikes);
    } catch (err) {
      console.log('Error get likes by user :-', err);
    }
  };

const addALike = async (req, res) => {
  try {
    const param = [req.body.userId, req.body.imageId];
    const upload = await model.addLikeCount(param);
    res.send({ message: 'Like sucessfully added' });
  } catch (err) {
    console.log('Error add like :-', err);
  }
};

const deleteLike = async (req, res) => {
  try {
    const param = [req.body.imageId, req.body.userId];
    const upload = await model.removeLike(param);
    res.send({ message: 'Like sucessfully removed' });
  } catch (err) {
    console.log('Error delete like :-', err);
  }
};

const likeStatus = async (req, res) => {
  try {
    const param = [req.body.imageId, req.body.userId];
    const [upload] = await model.getLikedStatus(param);
    if (upload) {
      res.send({ status: upload });
    } else {
      res.send({ status: false });
    }
  } catch (err) {
    console.log('Error like status :-', err);
  }
};

export { addALike, deleteLike, getLikesByImage, getLikesByUser, likeStatus };
