'use strict';
import pool from '../db/databse.js';

// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();

const getUsersList = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM `user`');
    return rows;
  } catch (e) {
    consol.log('Error getUserList:-', e);
  }
};

const getUserWithId = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM `user` WHERE `user_id` =?', [
      id,
    ]);
    return rows;
  } catch (e) {
    consol.log('Error getUserWithEmail:-', e);
  }
};

const getUserWithEmail = async (email) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM `user` WHERE `email` =?', [
      email,
    ]);
    return rows;
  } catch (e) {
    consol.log('Error getUserWithEmail:-', e);
  }
};

export { getUsersList, getUserWithId, getUserWithEmail };
