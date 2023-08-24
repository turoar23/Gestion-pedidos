const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ErrorLogsSchema = new Schema(
  {
    payload: { type: String },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('ErrorLogs', ErrorLogsSchema);
