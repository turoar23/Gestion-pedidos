const passport = require('passport');
// import * as jwtDecode from 'jwt-decode';
const jwtDecode = require('jwt-decode');

// FIXME: will be better to change this so make the routes more readeable
module.exports.authenticate = passport.authenticate('jwt', {
  session: false,
});

module.exports.authorize =
  (roles = []) =>
  (req, res, next) => {
    try {
      if (!req.user) throw new Error('User dosent exist');

      const hasRole = roles.find(role => req.user.role === role);

      if (!hasRole) throw new Error('Unauthorized');

      return next();
    } catch (error) {
      res.status(401);
      res.send(error.message);
    }
  };

module.exports.decodeToken = jwtToken => {
  return jwtDecode.default(jwtToken);
};
