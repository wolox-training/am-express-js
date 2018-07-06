const userController = require('./controllers/user'),
  authCheck = require('./middlewares/authCheck.js');

exports.init = app => {
  app.get('/users', [authCheck.checkUser], userController.listUsers);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  app.post('/users', [], userController.signUp);
  app.post('/users/sessions', [], userController.signIn);
};
