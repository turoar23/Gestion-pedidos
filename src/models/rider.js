const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const riderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    vehicle: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    code: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('Rider', riderSchema);
