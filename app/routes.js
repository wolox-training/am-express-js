const userController = require('./controllers/user');

exports.init = app => {
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  app.post('/users', [], userController.signUp);
  app.post('/users/sessions', [], userController.signIn);
};
