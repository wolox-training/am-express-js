const chai = require('chai'),
  assert = require('chai').assert,
  server = require('./../app'),
  should = chai.should(),
  errors = require('./../app/errors'),
  User = require('./../app/models').user;

const saltRounds = 10;

describe('/users POST', () => {
  it('it creates a new user', done => {
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
        User.findAll().then(u => {
          assert.isNotEmpty(u, 'Se creo un usuario');
        });
        done();
      });
  });

  it('should fail because email is in use', done => {
    User.createModel({
      firstName: 'firstName',
      lastName: 'lastName',
      username: 'username',
      password: 'password',
      email: 'email1@wolox.com.ar'
    });
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
        User.findOne({ where: { firstName: 'wrongName' } }).then(u => {
          assert.isNull(u, 'No se creo un usuario');
        });
        done();
      });
  });

  it('should fail because email is invalid', done => {
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
        User.findAll().then(u => {
          assert.isEmpty(u, 'No se creo un usuario');
        });
        done();
      });
  });

  it('should fail because password is invalid', done => {
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
        User.findAll().then(u => {
          assert.isEmpty(u, 'No se creo un usuario');
        });
        done();
      });
  });

  it('should fail because not enough parameters', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'firstName',
        password: 'password',
        email: 'email1@wolox.com.ar'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        User.findAll().then(u => {
          assert.isEmpty(u, 'No se creo un usuario');
        });
        done();
      });
  });
});
