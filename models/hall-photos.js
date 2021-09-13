const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: { type: String },
  path: { type: String },
  pathResize: { type: String }
  // hall: { type: Schema.Types.ObjectId, ref: 'halls', required: true }
});

module.exports = model('hallPhotos', schema);
