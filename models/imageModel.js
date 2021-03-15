'use strict';
import pool from '../db/databse.js';

// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();

const getAllImages = async () => {
  try {
    // query database using promises
    const [rows] = await promisePool.execute('SELECT * FROM `image`');
    return rows;
  } catch (e) {
    console.log('Error getAllPosts:-', e);
  }
};

const getImageById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM `image` WHERE `image_id`=?',
      [id]
    );
    return rows;
  } catch (e) {
    console.log('Error getImageById:-', e);
  }
};

const postImage = async (data) => {
  try {
    const [rows] = await promisePool.query(
      'INSERT INTO `image` (`imagename`,`user_id`) VALUES (?,?)',
      data
    );
    return rows;
  } catch (e) {
    console.log('Error postImage:-', postImage);
  }
};

export { getAllImages, getImageById, postImage};
