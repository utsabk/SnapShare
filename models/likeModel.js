'use strict';
import pool from '../db/databse.js';

// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();

const getTotalLikesByImage = async (imageId) => {
    try{
      const [rows] = await promisePool.execute(
        'SELECT `image_id`, count(*) as likes_count FROM `likes` WHERE `image_id` = ?;',
        [imageId]
      )
      return rows;
    }catch (e){
      console.log(e.message);
    }
  }

  const getTotalLikesByUser = async (userId) => {
    try{
      const [rows] = await promisePool.execute(
        'SELECT count(*) as count FROM `likes`  JOIN `image` ON likes.image_id = image.image_id WHERE `owner_id` = ?;',
        [userId]
      )
      return rows;
    }catch (e){
      console.log(e.message);
    }
  }

const addLikeCount = async (param) => {
    console.log('This are param:-',param);
    try{
      const [rows] = await promisePool.execute(
        'INSERT IGNORE INTO `likes`  (`user_id`, `image_id`) VALUES (?,?);',
        param
      )
      return rows;
    }catch (e){
      console.log(e.message);
    }
  }
  
  const removeLike = async (param) => {
    try{
      const [rows] = await promisePool.execute(
        'DELETE FROM `likes` WHERE `image_id` = ? AND `user_id` = ?;',
        param
      )
      return rows;
    }catch (e){
      console.log(e.message);
    }
  }

  const getLikedStatus = async (param) => {
    try{
        const [rows] = await promisePool.execute(
          'SELECT * FROM `likes` WHERE `image_id` = ? AND `user_id` = ?;',
          param
        )
        return rows;
      }catch (e){
        console.log(e.message);
      }
  }
  

  export { addLikeCount, getTotalLikesByImage, getTotalLikesByUser, removeLike, getLikedStatus};
