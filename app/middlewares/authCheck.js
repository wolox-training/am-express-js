const errors = require('../errors'),
  User = require('../models').user,
  config = require('../../config'),
  moment = require('moment'),
  sessionsManager = require('../services/sessionsManager.js');

exports.checkUser = (req, res, next) => {
  const auth = req.headers.authorization; // auth is in base64(username:password)  so we need to decode the base64
  try {
    const decoded = sessionsManager.decode(auth);
    const validFrom = moment().subtract(config.common.daySessionIsValid, 'day');
    if (moment(decoded.exp) < validFrom) next(errors.expiredSession);
    req.user = decoded;
    next();
  } catch (e) {
    next(errors.unauthorizedNoLogin);
  }
};

exports.checkValidUserId = (req, res, next) => {
  return User.findOne({ where: { id: req.params.user_id } })
    .then(user => {
      if (user && user.id === req.user.id) {
        next();
      } else {
        next(errors.parametersInvalid);
      }
    })
    .catch(error => {
      next(error);
    });
};
