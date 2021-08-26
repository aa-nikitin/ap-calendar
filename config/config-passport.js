const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Users = mongoose.model('users');
const config = require('config');
const bcrypt = require('bcryptjs');

const secret = config.get('secret');

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

// const params = {
//   secretOrKey: secret,
//   jwtFromRequest: (req) => {
//     var token = null;
//     if ((req && req.cookies) || req.headers) {
//       token = req.cookies['jwt'] || req.cookies['access_token'] || req.headers['access_token'];
//     }
//     return token;
//   }
// };
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
};

passport.use(
  new LocalStrategy(
    {
      usernameField: 'login',
      passwordField: 'password'
    },
    async function (login, password, done) {
      try {
        const user = await Users.findOne({ login });
        if (!user) {
          return done(null, false);
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false);
          // return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new Strategy(params, ({ id }, done) => {
    Users.findOne({ id })
      .then((user) => {
        if (!user) {
          return done(new Error('User not found'));
        }
        return done(null, user);
      })
      .catch((err) => done(err));
  })
);
