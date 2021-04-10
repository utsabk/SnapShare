'use strict';
import passport from './pass.js';

/**
 * A middleware function to authenticate the routes using the passport authentication
 * @param {*} req express request object 
 * @param {*} res express response object
 * @callback next 
 * @returns a promise,
 */
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