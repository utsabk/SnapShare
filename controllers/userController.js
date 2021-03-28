'use strict';
import * as model from '../models/userModel.js';

const userWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const [user] = await model.getUserWithId(id);
    if(user){
      delete user.password;
      res.json(user);
    }  
  } catch (err) {
    console.log('Error getting user:-', err);
  }
};

const uploadProfile = async (req, res) => {
  try {
    const data = [req.file.filename, req.body.ownerId];
    const upload = await model.postProfile(data);
    res.send({ status: 'profile uploaded' });
  } catch (err) {
    console.log('Error uploading profile:-', err);
  }
};

export { uploadProfile, userWithId };
