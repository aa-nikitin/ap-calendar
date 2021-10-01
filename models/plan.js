const { Schema, model } = require('mongoose');

const schema = new Schema({
  date: { type: Date, require: true },
  time: { type: Date, require: true },
  minutes: { type: Number, require: true },
  hall: { type: Schema.Types.ObjectId, ref: 'halls' },
  client: { type: Schema.Types.ObjectId, ref: 'clients' },
  clientInfo: {
    name: { type: String, required: true },
    alias: { type: String },
    phone: { type: String },
    email: { type: String }
  },
  comment: { type: String }
});

module.exports = model('plan', schema);
