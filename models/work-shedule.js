const { Schema, model } = require('mongoose');

const schema = new Schema({
  minutesStep: { type: Number, require: true },
  hourSize: { type: Number, require: true },
  minutesFrom: { type: Number, require: true },
  minutesTo: { type: Number, require: true },
  list: { type: Array, require: true }
});

module.exports = model('workShedule', schema);
