// const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');

const Users = require('../models/users');
const Permission = require('../models/permission');

const secret = config.get('secret');

module.exports.login = (req, res, next) =>
  passport.authenticate('local', { session: false }, async (_, user) => {
    try {
      if (!user) {
        return res.status(400).json({
          error: true,
          message: 'Укажите правильный логин и пароль'
        });
      }
      if (user) {
        const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '3h' });
        res.json({ error: false, token: token, userId: user.id });
      }
    } catch (error) {
      return next(error);
    }
  })(req, res, next);

module.exports.authFromToken = (req, res, next) =>
  passport.authenticate('jwt', { session: false }, async (_, user) => {
    try {
      if (!user) {
        return res.status(400).json({
          error: true,
          message: ``
        });
      }
      if (user) {
        let output;
        try {
          const userAuth = await Users.findOne({ _id: user.id }).populate('permission');

          output = res.status(200).json({ error: false, id: userAuth._id });
        } catch (e) {
          output = res.status(400).json({
            error: true,
            message: `Произошла ошибка: ${e.message}`
          });
        }

        return output;
      }
    } catch (error) {
      return next(error);
    }
  })(req, res, next);

module.exports.registration = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный данные при регистрации'
      });
    }

    const { login, password, permission } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const candidate = await Users.findOne({ login });

    if (candidate) {
      return res.status(400).json({ message: 'Такой пользователь уже существует' });
    }

    const newPermission = new Permission({
      users: permission.users,
      setting: permission.setting
    });
    const perm = await newPermission.save();

    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new Users({ login, password: hashedPassword, permission: perm._id });

    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};
