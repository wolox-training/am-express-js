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

exports.makeid = () => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};
