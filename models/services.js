const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: { type: String, require: true },
  price: { type: String, require: true },
  hourly: { type: Boolean, default: false }
});

module.exports = model('services', schema);
