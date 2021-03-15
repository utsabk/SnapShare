'use strict';
import pool from '../db/databse.js';

// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();

const getAllPosts = async () => {
  try {
    // query database using promises
    const [rows] = await promisePool.query('SELECT * FROM `image`');
    console.log('this is rows:-', rows);
    return rows;
  } catch (e) {
    console.log('Error getAllPosts:-', e);
  }
};

export { getAllPosts };
