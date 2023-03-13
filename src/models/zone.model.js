const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ZoneSchema = new Schema(
  {
    name: { type: String, required: true },
    restaurants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('Zone', ZoneSchema);
