const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const auth = require('../middlewares/auth');
const UserModel = require('../models/user');
const usersController = require('../controllers/usersController');

const Router = express.Router();

Router.post(
	'/signup',
	// passport.authenticate('signup', { session: false }),
	async (req, res, next) => {
		try {
			const newUser = await UserModel.create(req.body);
			newUser.password = undefined;

			res.send(newUser);
		} catch (error) {
			res.status(400);
			res.send('That email is already used');
		}
	}
);

Router.post('/login', async (req, res, next) => {
	passport.authenticate('login', async (err, user, info) => {
		try {
			if (err || !user) {
				// const error = new Error('An error occurred.');

				// return next(error);
				res.status(401);
				res.send({ message: 'User or password wrong.' });
			} else {
				req.login(user, { session: false }, async error => {
					if (error) return next(error);

					const body = {
						_id: user._id,
						email: user.email,
						role: user.role,
					};
					const token = jwt.sign({ user: body }, 'TOP_SECRET');

					return res.json({ token });
				});
			}
		} catch (error) {
			return next(error);
		}
	})(req, res, next);
});

Router.get(
	'/profile',
	passport.authenticate('jwt', { session: false }),
	auth.authorize(['Admin']),
	async (req, res, next) => {
		res.send(req.user);
	}
);

Router.get('/users', usersController.getAllUsers);
Router.post('/users', usersController.postNewUser);
Router.put('/users/:userId', usersController.updateUser);
Router.delete('/users/:userId', usersController.deleteUser);

module.exports = Router;
