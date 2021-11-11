const { Schema, model } = require('mongoose');

const schema = new Schema({
  date: { type: String, required: true }
});

module.exports = model('holidays', schema);
