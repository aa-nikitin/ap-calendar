const { Schema, model } = require('mongoose');

const schema = new Schema({
  email: { type: String },
  fromWhom: { type: String },
  host: { type: String },
  port: { type: Number },
  userAuth: { type: String },
  passAuth: { type: String }
});

module.exports = model('mailPost', schema);
