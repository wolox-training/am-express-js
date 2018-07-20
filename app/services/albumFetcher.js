const User = require('../models').user,
  albums = require('../models').album,
  logger = require('../logger'),
  config = require('../../config'),
  fetch = require('node-fetch'),
  axios = require('axios'),
  sessionsManager = require('../services/sessionsManager'),
  errors = require('../errors');

exports.listAlbums = () => {
  const url = `${config.common.albumList}/albums`;
  return axios.get(url).then(response => {
    return response.data;
  });
};

exports.getAlbumById = albumId => {
  const url = `${config.common.albumList}/albums/${albumId}`;
  return axios.get(url).then(response => response.data);
};
