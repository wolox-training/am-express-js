const userController = require('./controllers/user'),
  albumController = require('./controllers/albums'),
  albumFetcher = require('./middlewares/albumfetcher.js'),
  authCheck = require('./middlewares/authCheck.js');

exports.init = app => {
  app.get('/users', [authCheck.checkUser], userController.listUsers);
  app.get('/users/albums/:id/photos', [authCheck.checkUser], albumController.showAlbumPhotos);
  app.get('/albums', [authCheck.checkUser], albumController.listAlbums);
  app.get(
    '/users/:user_id/albums',
    [authCheck.checkUser, authCheck.checkValidUserId],
    albumController.showAlbumsBought
  );
  app.post('/albums/:id', [authCheck.checkUser, albumFetcher.checkValidAlbumId], albumController.buyAlbum);
  app.post('/users/sessions/invalidate_all', [], userController.expireAllUsers);
  app.post('/users', [], userController.signUp);
  app.post('/users/sessions', [], userController.signIn);
  app.post('/admin/users', [], userController.adminSignUp);
};
