const { Schema, model } = require('mongoose');

const schema = new Schema({
  loginPK: { type: String },
  passPK: { type: String },
  serverPK: { type: String }
});

module.exports = model('paykeeper', schema);
