const User = require('../models').user,
  albums = require('../models').albums,
  logger = require('../logger'),
  config = require('../../config'),
  fetch = require('node-fetch'),
  axios = require('axios'),
  sessionsManager = require('../services/sessionsManager'),
  errors = require('../errors');
