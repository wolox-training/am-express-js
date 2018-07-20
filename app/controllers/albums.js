const User = require('../models').user,
  Album = require('../models').album,
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
    .then(albumList => {
      res.status(200).send({ albums: albumList });
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
  return Album.createModel(sale)
    .then(newSale => {
      res.status(201).send({ sale: newSale });
    })
    .catch(err => {
      next(err);
    });
};

exports.showAlbumsBought = (req, res, next) => {
  return Album.findAll({ where: { userId: req.user.id } })
    .then(purchases => {
      const promises = purchases.map(element => {
        return albumFetcher.getAlbumById(element.albumId);
      });
      return Promise.all(promises).then(albumsBought => {
        logger.info('Showed album bought correctly');
        res.status(200);
        res.send({ albums: albumsBought });
      });
    })
    .catch(error => {
      next(error);
    });
};
