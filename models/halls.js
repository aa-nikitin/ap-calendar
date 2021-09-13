const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: { type: String, required: true },
  square: { type: String, required: true },
  ceilingHeight: { type: String, required: true },
  priceFrom: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true, default: 0 }
});

module.exports = model('halls', schema);
