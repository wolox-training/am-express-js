const errors = require('../errors'),
  User = require('../models').user,
  sessionsManager = require('../services/sessionsManager.js');

exports.checkUser = (req, res, next) => {
  const auth = req.headers.authorization; // auth is in base64(username:password)  so we need to decode the base64
  try {
    const decoded = sessionsManager.decode(auth);
    req.user = decoded;
    next();
  } catch (e) {
    next(errors.unauthorizedNoLogin);
  }
};

exports.checkValidUserId = (req, res, next) => {
  return User.findOne({ where: { id: req.params.user_id } })
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        throw errors.parametersInvalid;
      }
    })
    .catch(error => {
      next(error);
    });
};
