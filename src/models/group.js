const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema(
  {
    rider: {
      type: Schema.Types.ObjectId,
      ref: 'Rider',
    },
    status: {
      type: String,
      default: 'Active',
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  },
  { versionKey: false }
);

module.exports = mongoose.model('Group', groupSchema);
