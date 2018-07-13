const User = require('../models').user,
  albums = require('../models').albums,
  logger = require('../logger'),
  config = require('../../config'),
  fetch = require('node-fetch'),
  axios = require('axios'),
  sessionsManager = require('../services/sessionsManager'),
  errors = require('../errors');

exports.listAlbums = (req, res, next) => {
  const url = `${config.common.albumList}/albums`;
  return axios.get(url).then(json => {
    logger.info('User requested albums and received album list');
    res.status(200).send(json.data);
  });
};

exports.buyAlbum = (req, res, next) => {
  const sale = {
    userId: req.user.id,
    albumId: req.params.id
  };
  return albums
    .createModel(sale)
    .then(newSale => {
      res.status(201).send({ sale: newSale });
    })
    .catch(err => {
      next(err);
    });
};
