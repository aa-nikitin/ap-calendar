const { Schema, model } = require('mongoose');

const schema = new Schema({
  login: { type: String, require: true },
  password: { type: String, require: true }
});

module.exports = model('users', schema);
