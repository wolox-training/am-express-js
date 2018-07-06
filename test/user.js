const chai = require('chai'),
  server = require('./../app'),
  dictum = require('dictum.js'),
  should = chai.should(),
  bcrypt = require('bcryptjs'),
  sessionsManager = require('./../app/services/sessionsManager'),
  errors = require('./../app/errors'),
  User = require('./../app/models').user;

const saltRounds = 10;

describe('users controller', () => {
  describe('/users GET', () => {
    it('lists users correctly', done => {
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
                .get('/users?page=1&limit=3')
                .set(sessionsManager.HEADER_NAME, auth.headers[sessionsManager.HEADER_NAME])
                .then(res => {
                  res.should.have.status(200);
                  res.should.be.json;
                  dictum.chai(res);
                  done();
                });
            });
        });
    });
    it('rejects not logged in user', done => {
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
            .get('/users?page=1&limit=3')
            .catch(err => {
              err.should.have.status(403);
              err.response.should.be.json;
              err.response.body.should.have.property('message');
              err.response.body.should.have.property('internal_code');
              done();
            });
        });
    });
  });
  describe('/users/sessions POST', () => {
    it('Login Successful', done => {
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
            .then(res => {
              res.should.have.status(200);
              res.headers[sessionsManager.HEADER_NAME].should.exist;
              dictum.chai(res, 'User has logged in');
              done();
            });
        });
    });

    it('doesnt find email in database', done => {
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
              email: 'email2@wolox.com.ar',
              password: 'password'
            })
            .catch(err => {
              err.should.have.status(400);
              err.response.should.be.json;
              err.response.body.should.have.property('message');
              err.response.body.should.have.property('internal_code');
              done();
            });
        });
    });

    it('rejects incorrect password', done => {
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
              password: 'passworX'
            })
            .catch(err => {
              err.should.have.status(400);
              err.response.should.be.json;
              err.response.body.should.have.property('message');
              err.response.body.should.have.property('internal_code');
              done();
            });
        });
    });
  });

  describe('/users POST', () => {
    it('creates a new user', done => {
      User.count().then(oldCount => {
        chai
          .request(server)
          .post('/users')
          .send({
            firstName: 'firstName',
            lastName: 'lastName',
            username: 'username',
            password: 'password',
            email: 'email1@wolox.com.ar'
          })
          .then(res => {
            res.should.have.status(201);
            res.body.should.have.property('user');
            res.body.user.should.have.property('created_at');
            User.count().then(newCount => {
              newCount.should.be.equal(oldCount + 1);
              dictum.chai(res, 'Creates a new user');
              done();
            });
          });
      });
    });

    it('should fail because email is in use', done => {
      User.createModel({
        firstName: 'firstName',
        lastName: 'lastName',
        username: 'username',
        password: 'password',
        email: 'email1@wolox.com.ar'
      }).then(() => {
        User.count().then(oldCount => {
          chai
            .request(server)
            .post('/users')
            .send({
              firstName: 'wrongName',
              lastName: 'lastName',
              username: 'username',
              password: 'password',
              email: 'email1@wolox.com.ar'
            })
            .catch(err => {
              err.should.have.status(422);
              err.response.should.be.json;
              err.response.body.should.have.property('message');
              err.response.body.should.have.property('internal_code');
              User.count().then(newCount => {
                newCount.should.be.equal(oldCount);
                done();
              });
            });
        });
      });
    });

    it('should fail because email is invalid', done => {
      User.count().then(oldCount => {
        chai
          .request(server)
          .post('/users')
          .send({
            firstName: 'firstName',
            lastName: 'lastName',
            username: 'username',
            password: 'password',
            email: 'email1@molox.com.ar'
          })
          .catch(err => {
            err.should.have.status(422);
            err.response.should.be.json;
            err.response.body.should.have.property('message');
            err.response.body.should.have.property('internal_code');
            User.count().then(newCount => {
              newCount.should.be.equal(oldCount);
              done();
            });
          });
      });
    });

    it('should fail because password is invalid', done => {
      User.count().then(oldCount => {
        chai
          .request(server)
          .post('/users')
          .send({
            firstName: 'firstName',
            lastName: 'lastName',
            username: 'username',
            password: 'passw',
            email: 'email1@wolox.com.ar'
          })
          .catch(err => {
            err.should.have.status(422);
            err.response.should.be.json;
            err.response.body.should.have.property('message');
            err.response.body.should.have.property('internal_code');
            User.count().then(newCount => {
              newCount.should.be.equal(oldCount);
              done();
            });
          });
      });
    });

    it('should fail because not enough parameters', done => {
      User.count().then(oldCount => {
        chai
          .request(server)
          .post('/users')
          .send({
            firstName: 'firstName',
            password: 'password',
            email: 'email1@wolox.com.ar'
          })
          .catch(err => {
            err.response.should.be.json;
            err.response.body.should.have.property('message');
            err.should.have.status(400);
            err.response.body.should.have.property('internal_code');
            User.count().then(newCount => {
              newCount.should.be.equal(oldCount);
              done();
            });
          });
      });
    });
  });
});
