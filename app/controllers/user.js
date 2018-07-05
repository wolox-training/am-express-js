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
  return isAlphanumeric.test(password) && password.length >= 8;
};

exports.signIn = (req, res, next) => {
  return User.getUserByEmail(req.body.email).then(user => {
    if (user) {
      bcrypt.compare(req.body.password, user.password).then(isValid => {
        if (isValid) {
          const auth = sessionsManager.encode({ email: user.email });
          res.status(200);
          res.set(sessionsManager.HEADER_NAME, auth);
          res.send(user);
        } else {
          return next(errors.incorrectCredentials);
        }
      });
    } else {
      logger.error(`Email: ${req.body.email} not found.`);
      return next(errors.incorrectCredentials);
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
};

exports.listUsers = (req, res, next) => {
  const auth = req.headers.authorization; // auth is in base64(username:password)  so we need to decode the base64
  try {
    const decoded = sessionsManager.decode(auth);
  } catch (e) {
    throw errors.unauthorizedNoLogin;
  }
  User.getUsers(req.query.page, req.query.limit)
    .then(users => {
      res.status(200).send(users);
    })
    .catch(err => {
      logger.error('Error looking for users in the database');
      next(err);
    });
};
