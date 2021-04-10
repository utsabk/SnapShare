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

/**
 * new LocalStrategy(options , callback)
 * @param {Object} options LocalStrategy takes an optional options hash before the callback function, 
 * @callback verify  LocalStrategy requires a verify callback, which accepts `username` & `password` and calls `done` providing a user
*/

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' }, // By default, LocalStrategy expects parameters username and password, we will override with email
    async (email, password, done) => { 
      try {

        // Make a DB call to check if user exists with entered email
        // Array destructuring to select only user from returned array
        const [user] = await getUserWithEmail(email);
        if (user == undefined) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        if (! await bcrypt.compare(password, user.password)) {
          return done(null, false, { message: ' Incorrect password' });
        }
        // delete password before returning user object
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

/**
 * The JWT authentication strategy is constructed as `JwtStrategy(options, verify)`
 * @param {Object} options is an object literal containing options to control how the token is extracted from the request or verified
 * @callback verify is a function with parameters `verify(jwtPayload,done)`, passes as Anonymous function 
 */
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // This is assuming that the client will send the JWT token in Authorization Header as a Bearer Token.
      secretOrKey: process.env.SECRET_KEY,
    },
    async (jwtPayload, done) => {
      try {
        //Find the user in DB
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
