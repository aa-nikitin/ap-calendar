// const { v4: uuidv4 } = require('uuid');
const Users = require('../models/users');

module.exports.auth = async (req, res) => {
  try {
    // const { category, _sort, _order } = req.query;
    // const findCategory = category ? { category: category } : {};
    // const orderSort = _order === 'asc' ? '' : '-';
    const users = await Users.find();
    res.json(users);
  } catch (e) {
    // res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

module.exports.registration = async (req, res) => {
  try {
    console.log(req.body);
    const { login, password } = req.body;
    const user = new Users({ login, password });

    await user.save();
    await res.json(user);
  } catch (e) {
    // res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};
