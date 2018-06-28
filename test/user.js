const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should(),
  errors = require('./../app/errors'),
  User = require('./../app/models').user;

describe('/users POST', () => {
  it('Successful', done => {
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
      })
      .then(() => done());
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
        firstName: 'firstName',
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
      })
      .then(() => done());
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
      })
      .then(() => done());
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
      })
      .then(() => done());
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
        err.response.should.be.json;
      })
      .then(() => done());
  });
});
