const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.EMAIL_DUPLICATED = 'email_duplicated';
exports.emailDuplicated = email => internalError(`email duplicated: ${email}`, exports.EMAIL_DUPLICATED);

exports.EMAIL_NOT_VALID = 'email_not_valid';
exports.emailNotValid = email => internalError(`email not valid: ${email}`, exports.EMAIL_NOT_VALID);

exports.PASSWORD_NOT_VALID = 'password_invalid';
exports.passwordInvalid = internalError('Password invalid', exports.PASSWORD_NOT_VALID);

exports.PARAMETERS_INVALID = 'parameters_invalid';
exports.parametersInvalid = internalError('Parameters incomplete or invalid', exports.PARAMETERS_INVALID);
