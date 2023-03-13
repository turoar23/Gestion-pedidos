const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepSchema = new Schema(
  {
    steps: [String],
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('Step', stepSchema);
