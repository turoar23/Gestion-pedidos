const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    restaurants: [
      {
        _id: {
          type: mongoose.Types.ObjectId,
          ref: 'Restaurant',
          required: true,
        },
        permissions: { type: String, required: true },
      },
    ],
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { versionKey: false, timestamps: true }
);

// @ts-ignore
UserSchema.pre('save', async function (next) {
  // @ts-ignore
  const hash = await bcrypt.hash(this.password, 10);

  // @ts-ignore
  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;

  // @ts-ignore
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
