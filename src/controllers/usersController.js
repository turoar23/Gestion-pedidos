const UserModel = require('../models/user');

/**
 * Receive a new order from GloriaFood
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();

    res.send(users);
  } catch (err) {
    throw new Error(err.message || 'There was an error');
  }
};

/**
 * Receive a new order from GloriaFood
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.postNewUser = async (req, res) => {
  try {
    const newUser = (await UserModel.create(req.body)).toObject();
    const userResult = { ...newUser, password: undefined };

    res.send(userResult);
  } catch (error) {
    res.status(400);
    res.send('That email is already used');
  }
};

/**
 * Receive a new order from GloriaFood
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    /**
     * @type {import('../types/user').IUser | null}
     */
    const user = await UserModel.findOne({ _id: userId });

    if (!user) res.status(400).send('Cant find that user');
    else {
      user.role = req.body.role || user.role;
      user.email = req.body.email || user.email;
      user.restaurants = req.body.restaurants || user.restaurants;
      const userUpdated = (await user.save()).toObject();
      const userResult = { ...userUpdated, password: undefined };

      res.send(userResult);
    }
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send('There was an error');
  }
};

/**
 * Receive a new order from GloriaFood
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findOne({ _id: userId });

    if (!user) res.status(400).send('Cant find that user');
    else {
      await user.remove();

      res.send({ message: 'User was removed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send('There was an error');
  }
};
