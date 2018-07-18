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
  User = require('./../../../app/models').user;

const saltRounds = 10;
nock('https://jsonplaceholder.typicode.com')
  .get('/albums')
  .reply(200, [
    {
      userId: 1,
      id: 1,
      title: 'quidem molestiae enim'
    }
  ]);

describe('albums controller', () => {
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
                  res.body.should.have.lengthOf(1);
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
