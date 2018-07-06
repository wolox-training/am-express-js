const userController = require('./controllers/user');

exports.init = app => {
  app.get('/users', [], userController.listUsers);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  app.post('/users', [], userController.signUp);
  app.post('/users/sessions', [], userController.signIn);
  app.post('/admin/users', [], userController.adminSignUp);
};
