const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: { type: String },
  path: { type: String },
  pathResize: { type: String }
});

module.exports = model('hallPhotos', schema);
