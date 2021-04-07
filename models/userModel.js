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
    const [rows] = await promisePool.execute('SELECT * FROM `user` WHERE `user_id` =?', 
    [id]); // Values should pass as an array
    return rows;
  } catch (e) {
    consol.log('Error getUserWithEmail:-', e);
  }
};

const getUserWithEmail = async (email) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM `user` WHERE `email` =?', [
      email,
    ]); // Values should pass as array
    return rows;
  } catch (e) {
    consol.log('Error getUserWithEmail:-', e);
  }
};

const getUserWithUsername = async (username) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM `user` WHERE `username` =?', [
      username,
    ]); // Values should pass as array
    return rows;
  } catch (e) {
    consol.log('Error getUserWithUsername:-', e);
  }
};


const uploadUserData = async (params) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT IGNORE INTO `user` (`username`, `email`, `password`) VALUES (?, ?, ?);',
      params // Arg are passed as an array
    );
    return rows;
  } catch (e) {
    console.log('Error uploadUserData:-', e);
  }
};

const postProfile = async(data)=>{
  try{
    const [rows] = await promisePool.execute(
      'UPDATE `user` SET `dp`=? WHERE `user_id`=?',
      data
    );
    return rows;
  }
  catch (err){
    console.log('Error postProfile:-',err)
  }
}

const updateUserData = async(data)=>{
  try{
    const [rows] = await promisePool.execute(
      'UPDATE `user` SET `username` = ?, `email` = ? WHERE `user_id`=?',
      data
    );
    return rows;
  }
  catch (err){
    console.log('Error update userdata:-',err)
  }
}

const userSearch = async(query) =>{
  try{
    const [rows] = await promisePool.execute(
      `SELECT * FROM image INNER JOIN user ON image.owner_id = user.user_id WHERE username LIKE '%${query}%' ORDER BY creation_date DESC;`
     // `SELECT * FROM user WHERE username LIKE '%${query}%' ;`
    )
   return rows;
  }catch (err){
    console.log('Error while search:-',err)
  }
}

export { getUsersList, getUserWithId, getUserWithEmail, uploadUserData, postProfile, getUserWithUsername, updateUserData, userSearch };
