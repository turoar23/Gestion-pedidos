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
