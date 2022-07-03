const UserModel = require('../models/user');

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();

    res.send(users);
  } catch (err) {
    throw new Error(err.message || 'There was an error');
  }
};

module.exports.postNewUser = async (req, res, next) => {
  try {
    const newUser = await UserModel.create(req.body);
    newUser.password = undefined;

    res.send(newUser);
  } catch (error) {
    res.status(400);
    res.send('That email is already used');
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findOne({ _id: userId });

    if (!user) res.status(400).send('Cant find that user');
    else {
      user.role = req.body.role || user.role;
      user.email = req.body.email || user.email;
      const userUpdated = await user.save();
      userUpdated.password = undefined;

      res.send(userUpdated);
    }
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send('There was an error');
  }
};

module.exports.deleteUser = async (req, res, next) => {
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
