const User = require('../models').user,
  Album = require('../models').albums,
  logger = require('../logger'),
  config = require('../../config'),
  fetch = require('node-fetch'),
  axios = require('axios'),
  albumFetcher = require('../services/albumFetcher'),
  sessionsManager = require('../services/sessionsManager'),
  errors = require('../errors');

exports.listAlbums = (req, res, next) => {
  const albumsList = [];
  albumFetcher
    .listAlbums(albumsList)
    .then(albums => {
      logger.info('Showed albums list');
      res.status(200).send({ albums });
    })
    .catch(error => {
      logger.error('Could not find list of albums bought');
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
      logger.info('User bought new album');
      res.status(201).send({ sale: newSale });
    })
    .catch(err => {
      logger.error('Could not buy album');
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
        logger.info('Showed list of albums bought by user');
        res.status(200);
        res.send({ albums: albumsBought });
      });
    })
    .catch(error => {
      logger.error('Could not find list of albums bought');
      next(error);
    });
};

exports.showAlbumPhotos = (req, res, next) => {
  return Album.findAll({ where: { userId: req.user.id, albumId: req.params.id } })
    .then(purchases => {
      const promises = purchases.map(element => {
        return albumFetcher.getAlbumPhotoById(element.albumId);
      });
      return Promise.all(promises).then(albumsBought => {
        logger.info('Showed album photos correctly');
        res.status(200);
        res.send({ albums: albumsBought });
      });
    })
    .catch(error => {
      logger.error('Could not find list of albums photos');
      next(error);
    });
};
