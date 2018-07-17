const userController = require('./controllers/user'),
  albumController = require('./controllers/albums'),
  authCheck = require('./middlewares/authCheck.js');

exports.init = app => {
  app.get('/users', [authCheck.checkUser], userController.listUsers);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  app.get('/albums', [authCheck.checkUser], albumController.listAlbums);
  app.post('/users', [], userController.signUp);
  app.post('/users/sessions', [], userController.signIn);
  app.post('/admin/users', [], userController.adminSignUp);
};
