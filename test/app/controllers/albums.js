const chai = require('chai'),
  server = require('./../../../app'),
  dictum = require('dictum.js'),
  should = chai.should(),
  bcrypt = require('bcryptjs'),
  sessionsManager = require('./../../../app/services/sessionsManager'),
  errors = require('./../../../app/errors'),
  simple = require('simple-mock'),
  nock = require('nock'),
  fetch = require('node-fetch'),
  albums = require('./../../../app/models').album,
  User = require('./../../../app/models').user;

const saltRounds = 10;

beforeEach(() => {
  nock('https://jsonplaceholder.typicode.com')
    .get('/albums')
    .reply(200, [
      {
        userId: 1,
        id: 1,
        title: 'quidem molestiae enim'
      }
    ]);

  nock('https://jsonplaceholder.typicode.com')
    .get('/albums/1')
    .reply(200, [
      {
        userId: 1,
        id: 1,
        title: 'quidem molestiae enim'
      }
    ]);

  nock('https://jsonplaceholder.typicode.com')
    .get('/albums/1/photos')
    .reply(200, [
      {
        userId: 1,
        id: 1,
        title: 'quidem molestiae enim',
        url: 'serele'
      }
    ]);

  nock('https://jsonplaceholder.typicode.com')
    .get('/albums/2')
    .reply(200, [
      {
        userId: 1,
        id: 2,
        title: 'sunt qui excepturi placeat culpa'
      }
    ]);

  nock('https://jsonplaceholder.typicode.com')
    .get('/albums/2/photos')
    .reply(200, [
      {
        userId: 1,
        id: 2,
        title: 'sunt qui excepturi placeat culpa',
        url: 'sarasa'
      }
    ]);

  nock('https://jsonplaceholder.typicode.com')
    .get('/albums/1000')
    .reply(404, []);
});

describe('albums controller', () => {
  describe('/users/albums/:id/photos GET', () => {
    it('shows bought albums photos', done => {
      const user = {
        firstName: 'firstName',
        lastName: 'lastName',
        username: 'username',
        password: 'password',
        email: 'email1@wolox.com.ar'
      };

      bcrypt
        .hash(user.password, saltRounds)
        .then(hash => {
          user.password = hash;
          return User.createModel(user);
        })
        .then(u => {
          const sale = {
            userId: 1,
            albumId: 1
          };
          albums.createModel(sale).then(firstSale => {
            sale.albumId = 2;
            albums.createModel(sale).then(secondSale => {
              albums.count().then(oldCount => {
                chai
                  .request(server)
                  .post('/users/sessions')
                  .send({
                    email: 'email1@wolox.com.ar',
                    password: 'password'
                  })
                  .then(auth => {
                    chai
                      .request(server)
                      .get('/users/albums/1/photos')
                      .set(sessionsManager.HEADER_NAME, auth.headers[sessionsManager.HEADER_NAME])
                      .then(res => {
                        res.should.have.status(200);
                        res.body.photos.should.have.lengthOf(oldCount - 1);
                        dictum.chai(res, 'Shows bought albums photos');
                        done();
                      });
                  });
              });
            });
          });
        });
    });
  });

  describe('/users/:userId/albums GET', () => {
    it('shows bought albums', done => {
      const user = {
        firstName: 'firstName',
        lastName: 'lastName',
        username: 'username',
        password: 'password',
        email: 'email1@wolox.com.ar'
      };

      bcrypt
        .hash(user.password, saltRounds)
        .then(hash => {
          user.password = hash;
          return User.createModel(user);
        })
        .then(u => {
          const sale = {
            userId: 1,
            albumId: 1
          };
          albums.createModel(sale).then(firstSale => {
            sale.albumId = 2;
            albums.createModel(sale).then(secondSale => {
              albums.count().then(oldCount => {
                chai
                  .request(server)
                  .post('/users/sessions')
                  .send({
                    email: 'email1@wolox.com.ar',
                    password: 'password'
                  })
                  .then(auth => {
                    chai
                      .request(server)
                      .get('/users/1/albums')
                      .set(sessionsManager.HEADER_NAME, auth.headers[sessionsManager.HEADER_NAME])
                      .then(res => {
                        res.should.have.status(200);
                        res.body.albums.should.have.lengthOf(oldCount);
                        dictum.chai(res, 'Shows bought albums');
                        done();
                      });
                  });
              });
            });
          });
        });
    });

    it('denies invalid user id', done => {
      const user = {
        firstName: 'firstName',
        lastName: 'lastName',
        username: 'username',
        password: 'password',
        email: 'email1@wolox.com.ar'
      };

      bcrypt
        .hash(user.password, saltRounds)
        .then(hash => {
          user.password = hash;
          return User.createModel(user);
        })
        .then(u => {
          const sale = {
            userId: 1,
            albumId: 1
          };
          albums.createModel(sale).then(firstSale => {
            sale.albumId = 2;
            albums.createModel(sale).then(s => {
              chai
                .request(server)
                .post('/users/sessions')
                .send({
                  email: 'email1@wolox.com.ar',
                  password: 'password'
                })
                .then(auth => {
                  chai
                    .request(server)
                    .get('/users/1000/albums')
                    .set(sessionsManager.HEADER_NAME, auth.headers[sessionsManager.HEADER_NAME])
                    .catch(error => {
                      error.should.have.status(400);
                      error.response.body.should.have.property('message');
                      error.response.body.should.have.property('internal_code');
                      done();
                    });
                });
            });
          });
        });
    });
  });

  describe('/albums/:id POST', () => {
    it('buys album correctly', done => {
      const user = {
        firstName: 'firstName',
        lastName: 'lastName',
        username: 'username',
        password: 'password',
        email: 'email1@wolox.com.ar'
      };

      bcrypt
        .hash(user.password, saltRounds)
        .then(hash => {
          user.password = hash;
          return User.createModel(user);
        })
        .then(u => {
          chai
            .request(server)
            .post('/users/sessions')
            .send({
              email: 'email1@wolox.com.ar',
              password: 'password'
            })
            .then(auth => {
              chai
                .request(server)
                .post('/albums/1')
                .set(sessionsManager.HEADER_NAME, auth.headers[sessionsManager.HEADER_NAME])
                .then(res => {
                  res.should.have.status(201);
                  res.body.should.have.property('sale');
                  dictum.chai(res, 'User buys album');
                  done();
                });
            });
        });
    });

    it('doesnt accept album ID', done => {
      const user = {
        firstName: 'firstName',
        lastName: 'lastName',
        username: 'username',
        password: 'password',
        email: 'email1@wolox.com.ar'
      };

      bcrypt
        .hash(user.password, saltRounds)
        .then(hash => {
          user.password = hash;
          return User.createModel(user);
        })
        .then(u => {
          chai
            .request(server)
            .post('/users/sessions')
            .send({
              email: 'email1@wolox.com.ar',
              password: 'password'
            })
            .then(auth => {
              chai
                .request(server)
                .post('/albums/1000')
                .set(sessionsManager.HEADER_NAME, auth.headers[sessionsManager.HEADER_NAME])
                .catch(error => {
                  error.should.have.status(404);
                  error.response.body.should.have.property('message');
                  error.response.body.should.have.property('internal_code');
                  done();
                });
            });
        });
    });

    it('doesnt let user buy album to non logged user', done => {
      chai
        .request(server)
        .post('/albums/1')
        .catch(err => {
          err.should.have.status(403);
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          done();
        });
    });

    it('doesnt let user buy album twice', done => {
      const user = {
        firstName: 'firstName',
        lastName: 'lastName',
        username: 'username',
        password: 'password',
        email: 'email1@wolox.com.ar'
      };

      bcrypt
        .hash(user.password, saltRounds)
        .then(hash => {
          user.password = hash;
          return User.createModel(user);
        })
        .then(u => {
          const sale = {
            userId: 1,
            albumId: 1
          };
          albums.createModel(sale).then(s => {
            chai
              .request(server)
              .post('/users/sessions')
              .send({
                email: 'email1@wolox.com.ar',
                password: 'password'
              })
              .then(auth => {
                chai
                  .request(server)
                  .post('/albums/1')
                  .set(sessionsManager.HEADER_NAME, auth.headers[sessionsManager.HEADER_NAME])
                  .catch(err => {
                    err.should.have.status(422);
                    err.response.body.should.have.property('message');
                    err.response.body.should.have.property('internal_code');
                    done();
                  });
              });
          });
        });
    });
  });
  describe('/albums GET', () => {
    it('lists albums correctly', done => {
      const user = {
        firstName: 'firstName',
        lastName: 'lastName',
        username: 'username',
        password: 'password',
        email: 'email1@wolox.com.ar'
      };
      bcrypt
        .hash(user.password, saltRounds)
        .then(hash => {
          user.password = hash;
          return User.createModel(user);
        })
        .then(u => {
          chai
            .request(server)
            .post('/users/sessions')
            .send({
              email: 'email1@wolox.com.ar',
              password: 'password'
            })
            .then(auth => {
              chai
                .request(server)
                .get('/albums')
                .set(sessionsManager.HEADER_NAME, auth.headers[sessionsManager.HEADER_NAME])
                .then(res => {
                  res.should.have.status(200);
                  res.body.albums.should.have.lengthOf(1);
                  res.should.be.json;
                  dictum.chai(res, 'Returns all albums');
                  done();
                });
            });
        });
    });

    it('denies access to list albums to non logged user', done => {
      const user = {
        firstName: 'firstName',
        lastName: 'lastName',
        username: 'username',
        password: 'password',
        email: 'email1@wolox.com.ar'
      };

      bcrypt
        .hash(user.password, saltRounds)
        .then(hash => {
          user.password = hash;
          return User.createModel(user);
        })
        .then(auth => {
          chai
            .request(server)
            .get('/albums')
            .catch(err => {
              err.should.have.status(403);
              err.response.body.should.have.property('message');
              err.response.body.should.have.property('internal_code');
              done();
            });
        });
    });
  });
});
