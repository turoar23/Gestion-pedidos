const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    gloriaId: {
      type: Number,
      required: false,
    },
    client: {
      type: Object,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
    times: [
      {
        _id: false,
        by: {
          type: Number,
          required: true,
        },
        action: {
          type: String,
          required: true,
        },
      },
    ],
    payment: {
      type: String,
      required: true,
      default: null,
    },
    total_price: {
      type: Number,
    },
    for_later: {
      type: Boolean,
    },
    status: {
      type: String,
      required: true,
      default: 'Completed',
    },
    rider: {
      type: Schema.Types.ObjectId,
      ref: 'Rider',
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
    comments: {
      type: String,
      required: false,
    },
    surveySent: {
      type: Boolean,
      required: false,
    },
    statusCorrect: {
      type: Boolean,
      default: true,
    },
    items: {
      type: Array,
      default: [],
      required: false,
    },
    partner: {
      name: { type: String },
      id: { type: String },
      original: { type: Schema.Types.Mixed },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
