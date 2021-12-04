const { Schema, model } = require('mongoose');

const schema = new Schema({
  invoiceID: { type: String, required: true },
  invoiceUrl: { type: String, required: true },
  listPlans: { type: Array },
  orderId: { type: Number, require: true },
  percent: { type: Number, require: true }
});

module.exports = model('invoices', schema);
