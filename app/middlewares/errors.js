const errors = require('../errors'),
  logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.DEFAULT_ERROR]: 500,
  [errors.EMAIL_DUPLICATED]: 422,
  [errors.EMAIL_NOT_VALID]: 422,
  [errors.PASSWORD_NOT_VALID]: 422,
  [errors.ALREADY_BOUGHT]: 422,
  [errors.ALBUM_NOT_EXISTS]: 404,
  [errors.PARAMETERS_INVALID]: 400,
  [errors.INCORRECT_CREDENTIALS]: 400,
  [errors.UNAUTHORIZED_NO_LOGIN]: 403
};

exports.handle = (error, req, res, next) => {
  if (error.internalCode) {
    res.status(statusCodes[error.internalCode] || DEFAULT_STATUS_CODE);
  } else {
    // Unrecognized error, notifying it to rollbar.
    next(error);
    res.status(DEFAULT_STATUS_CODE);
  }
  logger.error(error);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
