const errors = require('../errors'),
  User = require('../models').user,
  time = require('time'),
  sessionsManager = require('../services/sessionsManager.js');

exports.checkUser = (req, res, next) => {
  const auth = req.headers.authorization; // auth is in base64(username:password)  so we need to decode the base64
  try {
    const decoded = sessionsManager.decode(auth);
    const currentTime = new time.Date();
    const diff =
      currentTime.getHours() * 60 + currentTime.getMinutes() - decoded.exp.hours * 60 - decoded.exp.minutes;
    if (diff > 5 || decoded.exp.time < sessionsManager.validFrom) throw errors.expiredSession;
    req.user = decoded;
    next();
  } catch (e) {
    next(errors.expiredSession);
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
