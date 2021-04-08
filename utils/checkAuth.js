'use strict';
import passport from './pass.js';


const checkAuth = (req, res,next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', (err, user) => {
        if (err || !user) {
          reject('Not authenticated or user expired');
        }
        resolve(user);
        next();
      })(req, res, next);
    });
  };

  export default checkAuth;