// const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');

const Users = require('../models/users');

const secret = config.get('secret');

// module.exports.auth = async (req, res) => {
//   try {
//     // const { category, _sort, _order } = req.query;
//     // const findCategory = category ? { category: category } : {};
//     // const orderSort = _order === 'asc' ? '' : '-';
//     const users = await Users.find();
//     res.json(users);
//   } catch (e) {
//     // res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
//   }
// };

module.exports.login = (req, res, next) => {
  passport.authenticate('local', { session: false }, async (_, user) => {
    try {
      if (!user) {
        return res.json({
          err: true,
          message: 'Укажите правильный логин и пароль'
        });
      }
      if (user) {
        const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
        res.json({ error: false, token: token });
      }
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

module.exports.loginToken = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({
        error: `Пользователь с таким токеном не найден`
      });
    }
    if (user) {
      Users.findOne({ id: user.id })
        .then((userAuth) => {
          res.status(200).json(userAuth);
        })
        .catch((err) => {
          return res.status(400).json({
            error: `Произошла ошибка: ${err.message}`
          });
        });
    }
  })(req, res, next);
};

module.exports.registration = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);

    const { login, password } = req.body;

    const candidate = await Users.findOne({ login });

    if (candidate) {
      return res.status(400).json({ message: 'Такой пользователь уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new Users({ login, password: hashedPassword });

    await user.save();
    await res.status(201).json(user);
  } catch (e) {
    // res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};
