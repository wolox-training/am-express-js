const jwt = require('jwt-simple'),
  config = require('./../../config');

const SECRET = config.common.session.secret;

exports.HEADER_NAME = config.common.session.header_name;

exports.blackList = [];

exports.encode = token => {
  return jwt.encode(token, SECRET);
};

exports.decode = token => {
  return jwt.decode(token, SECRET);
};

exports.blacklisted = (email, timeOfLogin) => {
  const blacklistedUser = this.blackList.find(function(element) {
    return element.userEmail === email;
  });
  console.log('BLuser: ');
  console.log(blacklistedUser);

  if (blacklistedUser && timeOfLogin < blacklistedUser.limit) return true;
  return false;
};
