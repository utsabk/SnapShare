'use strict';
import pool from '../db/databse.js';

// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();

const getAllImages = async () => {
  try {
    // query database using promises
    const [rows] = await promisePool.execute(
      'SELECT * FROM `image` INNER JOIN `user` ON image.owner_id = user.user_id;'
    );
    return rows;
  } catch (e) {
    console.log('Error getAllPosts:-', e);
  }
};

const getImageById = async (id) => {
  try {
    const [
      rows,
    ] = await promisePool.execute('SELECT * FROM `image` WHERE `image_id`=?', [
      id,
    ]);
    return rows;
  } catch (e) {
    console.log('Error getImageById:-', e);
  }
};

const postImage = async (data) => {
  console.log('This is data:-', data);
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO `image` (`imagename`,`owner_id`) VALUES (?,?)',
      data
    );
    return rows;
  } catch (err) {
    console.log('Error postImage:-', err);
  }
};

const deleteImage = async (id) => {
  try {
    const [rows] = await promisePool.execute('DELETE FROM `image` WHERE `image_id`=?', 
    [id]
    );
    return rows;
  } catch (err) {
    console.log('Error deleteimage:', err);
  }
};



export { getAllImages, getImageById, postImage,deleteImage};
