const User = require('../models').user,
  albums = require('../models').albums,
  logger = require('../logger'),
  config = require('../../config'),
  fetch = require('node-fetch'),
  axios = require('axios'),
  albumFetcher = require('../services/albumFetcher'),
  sessionsManager = require('../services/sessionsManager'),
  errors = require('../errors');

exports.listAlbums = (req, res, next) => {
  albumFetcher
    .listAlbums()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      next(error);
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
