'use strict';
import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import bcrypt from 'bcryptjs';
import { getUserWithEmail } from '../models/userModel.js';

// Need to initialize before JWTStrategy else *Cannot read property 'fromAuthHeaderAsBearerToken' of undefined*
const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        //select only user from DB returned array
        const [user] = await getUserWithEmail(email);
        if (user == undefined) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        if (!bcrypt.compare(password, user.password)) {
          return done(null, false, { message: ' Incorrect password' });
        }
        // delete password before returning
        delete user.password;

        return done(
          null,
          { ...user }, // use spread syntax to create shallow copy to get rid of binary row type
          { message: 'Logged in successfully' }
        );
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (jwtPayload, done) => {
      try {
        const user = await getUserWithEmail(jwtPayload.email);
        // delete password before returning
        delete user.password;
        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

export default passport;
