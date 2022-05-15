const { Schema, model } = require('mongoose');

const schema = new Schema({
  paymentType: { type: String, required: true },
  paymentDate: { type: Date, required: true },
  paymentWay: { type: String, required: true },
  paymentSum: { type: String, required: true, default: 'Action' },
  paymentPurpose: { type: String },
  invoiceID: { type: String },
  idPlan: { type: String, required: true },
  plan: { type: Schema.Types.ObjectId, ref: 'plan' },
  orderDate: { type: Date, required: true }
});

module.exports = model('payments', schema);
