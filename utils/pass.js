'use strict';
import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import { getUser, getUserLogin } from '../models/userModel.js';

// Need to initialize before JWTStrategy else *Cannot read property 'fromAuthHeaderAsBearerToken' of undefined*
const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;

passport.use(
  new LocalStrategy((username, password, done) => {
    try {
      const user = getUserLogin(username);
      console.log('User:-', user);
      if (user == undefined || user.password !== password) {
        return done(null, false, { message: 'Username or password incorrect' });
      }
      return done(null, { ...user }, { message: 'Logged in successfully' });
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (jwtPayload, done) => {
      try {
        const user = await getUserLogin(jwtPayload.email);
        delete user.password;
        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

export default passport;
