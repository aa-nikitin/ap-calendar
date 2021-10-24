const { Schema, model } = require('mongoose');

const schema = new Schema({
  purpose: { type: String, require: true },
  weekday: { type: String, require: true },
  daysOfWeek: { type: Array },
  worktime: { type: String, require: true },
  timeFrom: { type: Date },
  timeTo: { type: Date },
  fromHours: { type: Number },
  fromPersons: { type: Number },
  validityPeriod: { type: String, require: true },
  dateFrom: { type: Date },
  dateTo: { type: Date },
  price: { type: String, require: true },
  priceSum: { type: String, require: true },
  priority: { type: Number, require: true },
  roundUp: { type: Boolean },
  idHall: { type: String, require: true }
});

module.exports = model('Price', schema);
