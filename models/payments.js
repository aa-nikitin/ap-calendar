const { Schema, model } = require('mongoose');

const schema = new Schema({
  paymentType: { type: String, required: true },
  paymentDate: { type: Date, required: true },
  paymentWay: { type: String, required: true },
  paymentSum: { type: String, required: true },
  paymentPurpose: { type: String },
  idPlan: { type: String, required: true }
});

module.exports = model('payments', schema);
