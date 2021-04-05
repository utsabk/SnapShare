'use strict';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import passport from '../utils/pass.js';
import { uploadUserData } from '../models/userModel.js';

const authenticate = (req, res) => {
  // Authentication handled as Promise
  return new Promise((resolve, reject) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      try {
        if (err || !user) {
          reject(info.message);
        }
        req.login(user, { session: false }, (err) => {
          if (err) {
            reject(err);
          }
          const token = jwt.sign(user, process.env.SECRET_KEY);
          resolve({ user, token });
        });
      } catch (err) {
        reject(err.message);
      }
    })(req, res);
  });
};

const userLogin = async (req, res) => {
  try {
    const response = await authenticate(req, res);
    console.log('response from authenticate', response);
    return res.send({
      id: response.user._id,
      ...response.user,
      token: response.token,
    });
  } catch (err) {
    res.send({ error: err });
    //throw new Error(err);
  }
};
const userRegister = async (req, res, next) => {
  const hash = await bcrypt.hash(
    req.body.password,
    Number(process.env.SALT_ROUNDS) //SALT_ROUNDS converted to a number
  );

  const params = [req.body.username, req.body.email, hash];

  if (await uploadUserData(params)) {
    // This will call next middleware on the list
    next();
  } else {
    return res.status(400).json({ error: 'register error' });
  }
};

const userLogout = async (req, res) => {
  // Invoking logout() will remove the req.user property and clear the login session (if any).
  req.logout();
  res.json({ message: 'logout' });
};

export { userLogin, userRegister, userLogout };
