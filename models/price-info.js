const { Schema, model } = require('mongoose');

const schema = new Schema({
  addServices: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  percentDisount: { type: Number, default: 0 },
  totalDiscount: { type: Number, default: 0 },
  recalc: { type: Boolean, default: true },
  fixed: { type: Boolean, default: false },
  idPlan: { type: String, require: true }
});

module.exports = model('price-info', schema);
