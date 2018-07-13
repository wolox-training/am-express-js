const User = require('../models').user,
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
