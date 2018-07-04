const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should(),
  bcrypt = require('bcryptjs'),
  sessionsManager = require('./../app/services/sessionsManager'),
  errors = require('./../app/errors'),
  User = require('./../app/models').user;

const saltRounds = 10;

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
            sessionsManager.HEADER_NAME.should.exist;
          })
          .then(() => done());
      });
  });

  it('Email invalid', done => {
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
            err.should.have.status(422);
          })
          .then(() => done());
      });
  });

  it('Password invalid', done => {
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
            err.should.have.status(422);
          })
          .then(() => done());
      });
  });

  it('User list Successful', done => {
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
              .post('/users?page=1&limit=4')
              .send();
            console.log('daskdfhasjkfhajkfhjkasfhkjashfjksfhjksdfhkj');
          })
          .then(() => done());
      });
  });
});
