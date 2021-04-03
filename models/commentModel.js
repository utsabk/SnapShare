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
      'SELECT * FROM (comment INNER JOIN user ON comment.user_id = user.user_id) INNER JOIN image on comment.image_id = image.image_id WHERE comment.image_id = ?;',
      [ imageId ]
       // Values should pass as an array
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
    return rows;
  } catch (e) {
    console.log('Error postComment:', e);
  }
};

const addCommentCount = async(imageId) =>{
  try{
    const [rows] = await promisePool.execute(
      'UPDATE `image` SET `comment_count` = `comment_count` + 1 WHERE `image_id` = ?;',
      [imageId]
    )
    return rows;
  }catch (e){
    console.log(e.message);
  }
}

export { getCommentsList, getCommentsOfAnImage, postComment, addCommentCount};
