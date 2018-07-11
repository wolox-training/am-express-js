const User = require('../models').user,
  logger = require('../logger'),
  config = require('../../config'),
  fetch = require('node-fetch'),
  axios = require('axios'),
  sessionsManager = require('../services/sessionsManager'),
  errors = require('../errors');

exports.listAlbums = (req, res, next) => {
  const url = `${config.common.albumList}/albums`;
  console.log(`url ${url}`);
  return axios.get(url).then(json => {
    logger.info('User requested albums and received album list');
    res.status(200).send(json.data);
  });
};
