const { Schema, model } = require('mongoose');

const schema = new Schema({
  photo: { type: String }
});

module.exports = model('hallsPhotos', schema);
