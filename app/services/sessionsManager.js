const jwt = require('jwt-simple'),
  config = require('./../../config');

const SECRET = config.common.session.secret;

exports.HEADER_NAME = config.common.session.header_name;

exports.encode = token => {
  return jwt.encode(token, SECRET);
};

exports.decode = token => {
  return jwt.decode(token, SECRET);
};
