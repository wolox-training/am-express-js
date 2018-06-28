const bcrypt = require('bcryptjs'),
  User = require('../models').user,
  logger = require('../logger'),
  errors = require('../errors');

const saltRounds = 10;

const emailValid = email => {
  const re = /\S+@wolox.com.ar/;
  return re.test(email);
};

const passwordValid = password => {
  const isAlphanumeric = /^[a-z0-9]+$/i;
  if (isAlphanumeric.test(password) && password.length >= 8) {
    return true;
  } else {
    return false;
  }
};

exports.signUp = (req, res, next) => {
  if (!emailValid(req.body.email)) {
    logger.error(`Email: ${req.body.email} invalid.`);
    return next(errors.emailNotValid(req.body.email));
  }
  if (!passwordValid(req.body.password)) {
    logger.error('Password invalid.');
    return next(errors.passwordInvalid);
  }

  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  };

  logger.info(`All validations passed, going to create the user: ${JSON.stringify(user)}`);
  bcrypt
    .hash(user.password, saltRounds)
    .then(hash => {
      user.password = hash;
      return User.createModel(user).then(auxUser => {
        res.status(200).send({ user: auxUser });
      });
    })
    .catch(error => {
      logger.error('User creation failed');
      next(error);
    });
};
