const bcrypt = require('bcryptjs');
const User = require('../models').user;
const errors = require('../middlewares/errors.js');

const saltRounds = 10;

const emailValid = email => {
  const re = /\S+@wolox.com.ar/;
  return re.test(email);
};

const passwordVaild = password => {
  const isAlphanumeric = /^[a-z0-9]+$/i;
  if (isAlphanumeric.test(password) && password.length >= 8) {
    return true;
  } else {
    return false;
  }
};

exports.signUp = (req, res, next) => {
  if (!emailValid(req.body.email)) {
    console.log(req.body.email);
    res.status(600).send();
  }
  if (!passwordVaild(req.body.password)) {
    console.log(req.body.password);
    res.status(620).send();
  }

  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  };
  bcrypt
    .hash(user.password, saltRounds)
    .then(hash => {
      user.password = hash;
      User.createModel(user)
        .then(auxUser => {
          res.status(200).send(console.log(auxUser.firstName + auxUser.lastName));
        })
        .catch(function(error) {
          next(errors.handle(error));
        });
    })
    .catch(function(error) {
      console.log(error);
      next(errors.handle(error));
    });
};
