const User = require('../models').user,
  albums = require('../models').albums,
  logger = require('../logger'),
  fetch = require('node-fetch'),
  sessionsManager = require('../services/sessionsManager'),
  errors = require('../errors');

exports.listAlbums = (req, res, next) => {
  return fetch('https://jsonplaceholder.typicode.com/albums')
    .then(response => response.json())
    .then(json => {
      logger.info('User requested albums and received album list');
      res.status(200).send(json);
    });
};

exports.buyAlbum = (req, res, next) => {
  const decoded = sessionsManager.decode(req.headers.authorization);

  return User.findOne({ where: { email: decoded.email } })
    .then(user => {
      console.log(user.dataValues.id);
      const sale = {
        userId: user.dataValues.id,
        albumId: req.params.id
      };
      return albums.createModel(sale).then(newSale => {
        res.status(200).send({ sale: newSale });
      });
    })
    .catch(err => {
      next(err);
    });
};
