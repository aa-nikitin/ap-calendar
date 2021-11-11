const { Schema, model } = require('mongoose');

const schema = new Schema({
  hours: { type: Number, require: true },
  percent: { type: Number, require: true }
});

module.exports = model('prepayment', schema);
