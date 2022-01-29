const { Schema, model } = require('mongoose');

const schema = new Schema({
  idPlan: { type: String, require: true },
  typePrice: { type: String },
  idService: { type: String },
  name: { type: String },
  price: { type: Number },
  count: { type: Number },
  discount: { type: Number },
  total: { type: Number },
  hourly: { type: Boolean, default: false }
});

module.exports = model('planPrice', schema);
