const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
  users: {
    C: { type: Boolean, default: true },
    R: { type: Boolean, default: true },
    U: { type: Boolean, default: true },
    D: { type: Boolean, default: true }
  },
  setting: {
    C: { type: Boolean, default: true },
    R: { type: Boolean, default: true },
    U: { type: Boolean, default: true },
    D: { type: Boolean, default: true }
  }
});

module.exports = mongoose.model('permission', permissionSchema);
