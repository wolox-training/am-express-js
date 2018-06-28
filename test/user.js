const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should();

describe('/users POST', () => {
  it('Should fail due to email not unique', () => {
    chai.request(server).
    post('/users').
    then((res) => {
      res.should.have.status(201);
      res.should.be.json;
      dictum.chai(res, 'Sign up endpoint');
    });
  });;
