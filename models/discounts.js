const { Schema, model } = require('mongoose');

const schema = new Schema({
  purpose: { type: String, require: true },
  weekday: { type: String, require: true },
  daysOfWeek: { type: Array },
  condition: { type: String, require: true },
  dateFrom: { type: Date },
  dateTo: { type: Date },
  daysBeforeBooking: { type: String },
  fromHours: { type: Number },
  hall: { type: String, require: true },
  discount: { type: String, require: true },
  everyHour: { type: Boolean }
});

module.exports = model('discounts', schema);
