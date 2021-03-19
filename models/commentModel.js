import pool from '../db/databse.js';
const promisePool = pool.promise();

const getCommentsList = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM `comment`');
    return rows;
  } catch (e) {
    console.log('Error getCommentsList:-', e);
  }
};

const getCommentsOfAnImage = async (imageId) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM `comment` WHERE `image_id` = ?',
      [imageId] // Values should pass as an array
    );
    return rows;
  } catch (e) {
    console.log('Error getCommentsOfAnImage:', e);
  }
};

const postComment = async (param) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO `comment` (`content`,`user_id`,`image_id`) VALUES (?,?,?)',
      param
    );
  } catch (e) {
    console.log('Error postComment:', e);
  }
};

export { getCommentsList, getCommentsOfAnImage, postComment };
