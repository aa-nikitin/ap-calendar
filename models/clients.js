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
  comment: { type: String }
});

module.exports = model('clients', schema);
