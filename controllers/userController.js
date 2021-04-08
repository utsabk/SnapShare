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

const updateUserData = async (req, res) => {
  
  if(!req.body.about){
    req.body.about = '';
  }

  try {
    const data = [req.body.username, req.body.email, req.body.about, req.params.id];
    const upload = await model.updateUserData(data);
    if(upload){
      res.send({ status: 'user data updated' });
    }
  } catch (err) {
    console.log('Error updating userdata:-', err);
  }
};

const userSearch = async (req, res) => {
  try {
   const query = req.query.name;

   console.log('This is a query',query);

   const search = await model.userSearch(query);

    if(search){
      res.json(search);
    }


  } catch (err) {
  console.log('Error while searching:-',err);
  }
}


export { uploadProfile, userWithId, updateUserData, userSearch };
