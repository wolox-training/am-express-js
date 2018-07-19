const errors = require('../errors'),
  config = require('../../config'),
  logger = require('../logger'),
  axios = require('axios'),
  albumFetcher = require('../services/albumFetcher.js'),
  sessionsManager = require('../services/sessionsManager.js');

exports.checkValidAlbumId = (req, res, next) => {
  return albumFetcher
    .getAlbumById(req.params.id)
    .then(json => {
      logger.info('User requested albums and received album');
      req.album = json.data;
      next();
    })
    .catch(error => {
      next(errors.albumNotExists);
    });
};
