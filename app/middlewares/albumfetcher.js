const errors = require('../errors'),
  config = require('../../config'),
  logger = require('../logger'),
  axios = require('axios'),
  sessionsManager = require('../services/sessionsManager.js');

exports.checkValidAlbumId = (req, res, next) => {
  const url = `${config.common.albumList}/albums/${req.params.id}`;
  return axios
    .get(url)
    .then(json => {
      if (json) {
        logger.info('User requested albums and received album list');
        res.status(200).send(json.data);
      } else {
        throw errors.parametersInvalid;
      }
    })
    .catch(error => {
      next(error);
    });
};
