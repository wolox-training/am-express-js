const User = require('../models').user,
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
