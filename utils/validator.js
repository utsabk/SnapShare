import { body, validationResult } from 'express-validator';
import { getUserWithEmail, getUserWithUsername } from '../models/userModel.js';

const validationRules = () => {
  return [
    body('username', 'Minimum 3 characters')
      .isLength({ min: 3 })
      .custom(async (value) => {
        const [user] = await getUserWithUsername(value);
        if (user) {
          return Promise.reject('Username already taken');
        }
      })
      .trim()
      .escape(),
    body('email', 'Email is not valid')
      .isEmail()
      .custom(async (value) => {
        const [user] = await getUserWithEmail(value);
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      })
      .normalizeEmail(),
    body('password')
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
