const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const integrationsSchema = new Schema(
  {
    name: { type: String, required: true },
    key: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const restaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipcode: { type: String, required: true },
      country: { type: String, required: true },
    },
    emails: {
      global: { type: String },
      noreply: { type: String },
    },
    colors: {
      mainColor: { type: String },
    },
    integrations: [
      {
        type: integrationsSchema,
        required: true,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
