const jwt = require('jwt-simple'),
  config = require('./../../config');

const SECRET = config.common.session.secret;

exports.HEADER_NAME = config.common.session.header_name;

exports.encode = password => {
  return jwt.encode(password, SECRET);
};

exports.decode = password => {
  return jwt.decode(password, SECRET);
};
