'use strict';
import * as model from '../models/userModel.js';

const uploadProfile = async (req, res) => {
  try {
    const data = [req.file.filename, req.body.ownerId];
    const upload = await model.postProfile(data);
    res.send({ status: 'profile uploaded' });
  } catch (err) {
    console.log('Error uploading profile:-', err);
  }
};

export { uploadProfile };
