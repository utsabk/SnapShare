'use strict';
import pool from '../db/databse.js';

// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();

const getAllImages = async () => {
  try {
    // query database using promises
    const [rows] = await promisePool.query('SELECT * FROM `image`');
    return rows;
  } catch (e) {
    console.log('Error getAllPosts:-', e);
  }
};

export { getAllImages };
