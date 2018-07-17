const errors = require('../errors'),
  sessionsManager = require('../services/sessionsManager.js');

exports.checkUser = (req, res, next) => {
  const auth = req.headers.authorization; // auth is in base64(username:password)  so we need to decode the base64
  try {
    const decoded = sessionsManager.decode(auth);
    next();
  } catch (e) {
    next(errors.unauthorizedNoLogin);
  }
};
