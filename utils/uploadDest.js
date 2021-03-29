'use strict';
import multer from 'multer';

const storage = (path) =>
  multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, path);
    },
    filename: (req, file, cb) => {
      const ext = file.originalname.split('.').slice(-1);
      cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
  });
const uploadDestPost = multer({ storage: storage('./public/uploads/') });

const uploadDestProfile = multer({ storage: storage('./public/profiles/') });

export { uploadDestPost, uploadDestProfile };
