const bcrypt = require('bcryptjs'),
  User = require('../models').user,
  logger = require('../logger'),
  sessionsManager = require('../services/sessionsManager'),
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

exports.signIn = (req, res, next) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };
  return User.getUserByEmail(req.body.email).then(u => {
    if (u) {
      bcrypt.compare(user.password, u.password).then(isValid => {
        if (isValid) {
          const auth = sessionsManager.encode({ email: u.email });
          res.status(200);
          res.set(sessionsManager.HEADER_NAME, auth);
          res.send(u);
        } else {
          return next(errors.passwordInvalid);
        }
      });
    } else {
      logger.error(`Email: ${req.body.email} invalid.`);
      return next(errors.emailNotValid(user.email));
    }
  });
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
        res.status(201).send({ user: auxUser });
      });
    })
    .catch(error => {
      logger.error('User creation failed');
      next(error);
    });

    exports.listUsers = (req, res, next) => {
      try {
        const decoded = sessionsManager.decode(req.header.authorization);
      } catch (e) {
        throw new Error('No authorization');
      }
      return User.getUsers(req.body.page);
    }
};
