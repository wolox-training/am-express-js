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

const generateUser = (user, next) => {
  if (!emailValid(user.email)) {
    logger.error(`Email: ${user.email} invalid.`);
    return next(errors.emailNotValid(user.email));
  }
  if (!passwordValid(user.password)) {
    logger.error('Password invalid.');
    return next(errors.passwordInvalid);
  }
  logger.info(`All validations passed, going to create the user: ${JSON.stringify(user)}`);
  return bcrypt.hash(user.password, saltRounds).then(hash => {
    user.password = hash;
    return User.createModel(user, next);
  });
};
const giveAdminPriviledges = user => {
  return User.update({ admin: true }, { returning: true, where: { email: user.email } });
};

exports.adminSignUp = (req, res, next) => {
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    admin: true
  };
  User.getUserByEmail(req.body.email).then(existingUser => {
    if (existingUser) {
      bcrypt.compare(req.body.password, existingUser.password).then(isValid => {
        if (isValid) {
          giveAdminPriviledges(user)
            .then(() => {
              res.status(200);
              res.send({ newAdmin: existingUser });
            })
            .catch(err => {
              next(err);
            });
        } else {
          return next(errors.incorrectCredentials);
        }
      });
    } else {
      generateUser(user, next);
      giveAdminPriviledges(user, next)
        .then(auxUser => {
          res.status(201).send({ user });
        })
        .catch(error => {
          logger.error('admin creation failed');
          next(error);
        });
    }
  });
};

exports.signIn = (req, res, next) => {
  return User.getUserByEmail(req.body.email).then(user => {
    if (user) {
      bcrypt.compare(req.body.password, user.password).then(isValid => {
        if (isValid) {
          const auth = sessionsManager.encode({ email: user.email, id: user.id });
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
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    admin: false
  };
  generateUser(user, next)
    .then(auxUser => {
      res.status(201).send({ user: auxUser });
    })
    .catch(error => {
      logger.error('User creation failed');
      next(error);
    });
};

exports.listUsers = (req, res, next) => {
  User.count().then(total => {
    if (req.query.page < 1 || req.query.limit < 1) return next(errors.parametersInvalid);
    User.getUsers(req.query.page, req.query.limit)
      .then(users => {
        res.status(200).send({
          users,
          page: req.query.page ? req.query.page : 1,
          totalPages: Math.ceil(total / (req.query.limit ? req.query.limit : 10)),
          totalUsers: total
        });
      })
      .catch(err => {
        logger.error('Error looking for users in the database');
        next(err);
      });
  });
};
