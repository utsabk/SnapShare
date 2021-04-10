'use strict';
import multer from 'multer';

/**
 * 
 *
 * @param {String} path is the path to location where file is stored.
 */
const storage = (path) =>
  multer.diskStorage({
    destination: (req, res, cb) => { // `destination`determines within which folder the uploaded files should be stored
      cb(null, path);
    },
    filename: (req, file, cb) => { // `filename` determines what the file should be named inside the folder
      const ext = file.originalname.split('.').slice(-1);
      cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
  });

const uploadDestPost = multer({ storage: storage('./public/uploads/') }); // Assign 

const uploadDestProfile = multer({ storage: storage('./public/profiles/') });

export { uploadDestPost, uploadDestProfile };
