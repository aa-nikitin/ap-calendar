const { Schema, model } = require('mongoose');

const schema = new Schema({
  login: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  permission: { type: Schema.Types.ObjectId, ref: 'permission' }
});

module.exports = model('users', schema);
