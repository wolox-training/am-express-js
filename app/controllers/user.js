const bcrypt = require('bcryptjs'),
  User = require('../models').user,
  date = require('date-and-time'),
  time = require('time'),
  moment = require('moment'),
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

const generateUser = user => {
  if (!emailValid(user.email)) {
    logger.error(`Email: ${user.email} invalid.`);
    throw errors.emailNotValid(user.email);
  }
  if (!passwordValid(user.password)) {
    logger.error('Password invalid.');
    throw errors.passwordInvalid;
  }
  logger.info(`All validations passed, going to create the user: ${JSON.stringify(user)}`);
  return bcrypt.hash(user.password, saltRounds).then(hash => {
    user.password = hash;
    return User.createModel(user);
  });
};
const giveAdminPrivileges = userParams => {
  return User.update({ admin: true }, { returning: true, where: { email: userParams.email } });
};

exports.adminSignUp = (req, res, next) => {
  const userParams = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    admin: true,
    validFor: sessionsManager.makeid()
  };
  return User.getUserByEmail(req.body.email)
    .then(existingUser => {
      if (existingUser) {
        return bcrypt.compare(req.body.password, existingUser.password).then(isValid => {
          if (isValid) {
            return giveAdminPrivileges(existingUser).then(() => {
              res.status(200);
              res.send({ newAdmin: existingUser });
            });
          } else {
            throw errors.incorrectCredentials;
          }
        });
      } else {
        return generateUser(userParams, next).then(user => {
          return giveAdminPrivileges(user, next).then(() => {
            res.status(201).send({ user });
          });
        });
      }
    })
    .catch(error => {
      logger.error('admin creation failed');
      next(error);
    });
};

exports.expireAllUsers = (req, res, next) => {
  User.update({ validFor: sessionsManager.makeid() }, { returning: true, where: { email: req.user.email } })
    .then(dateSet => {
      res.status(200).send();
    })
    .catch(error => {
      logger.error('Update failed');
      next(error);
    });
};

exports.signIn = (req, res, next) => {
  return User.getUserByEmail(req.body.email).then(user => {
    if (user) {
      bcrypt.compare(req.body.password, user.password).then(isValid => {
        if (isValid) {
          const timeOfLogin = moment();
          const auth = sessionsManager.encode({
            email: user.email,
            id: user.id,
            exp: timeOfLogin,
            serial: user.validFor
          });
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
    admin: false,
    validFor: sessionsManager.makeid()
  };
  return generateUser(user, next)
    .then(auxUser => {
      res.status(201).send({ user: auxUser });
    })
    .catch(error => {
      logger.error('User creation failed');
      next(error);
    });
};

exports.listUsers = (req, res, next) => {
  if (req.query.page < 1 || req.query.limit < 1) return next(errors.parametersInvalid);
  User.getUsers(req.query.page, req.query.limit)
    .then(users => {
      res.status(200).send({
        users: users.rows,
        page: req.query.page ? req.query.page : 1,
        totalPages: Math.ceil(users.count / (req.query.limit ? req.query.limit : 10)),
        totalUsers: users.count
      });
    })
    .catch(err => {
      logger.error('Error looking for users in the database');
      next(err);
    });
};
