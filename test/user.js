const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should(),
  errors = require('./../app/errors'),
  User = require('./../app/models').user;

const saltRounds = 10;

describe('users controller', () => {
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
