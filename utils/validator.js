import { body, validationResult } from 'express-validator';
import {
  getUserWithEmail,
  getUserWithUsername,
  getUserWithId,
} from '../models/userModel.js';

const validationRules = () => {
  return [
    body('username', 'Minimum 3 characters')
      .isLength({ min: 3 })
      .custom(async (value, { req }) => {
        const userID = req.params.id;

        const [userWithUsername] = await getUserWithUsername(value);

        if (userWithUsername) {
          // only if username already exists

          if (!userID) {
            // if not signed in //when signning up first time
            return Promise.reject('Username already in use');
          } else {
            // if signed in // when updating username
            try {
              const [currentUser] = await getUserWithId(userID); // If defined outside, userID not found and error occoured

              if (currentUser.username == userWithUsername.username) {
                // check if username mathes with current user
                return Promise.resolve();
              } else {
                return Promise.reject('Username already in use');
              }
            } catch (e) {}
          }
        }
      })
      .trim()
      .escape(),

    body('email', 'Email is not valid')
      .isEmail()
      .custom(async (value, { req }) => {
        const userID = req.params.id;
        const [userWithEmail] = await getUserWithEmail(value);

        if (userWithEmail) {
          // only if email already exists
          if (!userID) {
            // if not signed in //when signning up first time
            return Promise.reject('E-mail already in use');
          } else {
            // if signed in // when updating email
            try {
              const [currentUser] = await getUserWithId(userID); // If defined outside, userID not found and error occoured

              if (currentUser.email == userWithEmail.email) {
                // check if email is current user's
                return Promise.resolve();
              } else {
                return Promise.reject('E-mail already in use');
              }
            } catch (err) {
              Error.throw(err);
            }
          }
        }
      })
      .normalizeEmail(),

    body('password')
      .optional()
      .matches('(?=.*[A-Z]).{5,}')
      .withMessage('Min 5 char with one capital letter'),

    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }

      // Indicates the success of this synchronous custom validator
      return true;
    }),
  ];
};

const validate = (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(400).json({ errors: extractedErrors });
  }
  next();
};

export { validationRules, validate };
