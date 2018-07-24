const jwt = require('jwt-simple'),
  User = require('../models').user,
  moment = require('moment'),
  errors = require('../errors'),
  config = require('./../../config');

const SECRET = config.common.session.secret;

exports.HEADER_NAME = config.common.session.header_name;

exports.encode = token => {
  return jwt.encode(token, SECRET);
};

exports.decode = token => {
  return jwt.decode(token, SECRET);
};

exports.blacklisted = (email, serial) => {
  return User.getUserByEmail(email)
    .then(user => {
      return user.validFor !== serial;
    })
    .catch(error => {
      return false;
    });
};
