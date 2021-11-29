const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: {
    first: { type: String, required: true, trim: true },
    last: { type: String, trim: true }
  },
  nickname: { type: String },
  company: { type: String },
  phone: { type: String },
  mail: { type: String },
  // mail: { type: [String] },
  comment: { type: String },
  socials: {
    vk: { type: String },
    fb: { type: String },
    ins: { type: String }
  },
  dateOfBirth: {
    day: { type: String },
    month: { type: String },
    year: { type: String }
  },
  blacklist: { type: Boolean, required: true, default: false }
});

module.exports = model('clients', schema);
