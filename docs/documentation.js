const dictum = require('dictum.js');

// For every endpoints

dictum.document({
  description: 'Sign up a new email',
  endpoint: '/users',
  method: 'POST',
  requestHeaders: {
    /* headers for endpoint */
  },
  requestPathParams: {
    /* path params for endpoint */
  },
  requestBodyParams: {
    firstName: 'asddas',
    lastName: 'value2',
    email: 'amoragues 09@wolox.com.ar',
    password: 'mocoreta'
  },
  responseStatus: 200,
  responseHeaders: {},
  responseBody: {
    id: 20,
    firstName: 'asddas',
    lastName: 'value2',
    email: 'amoragues 09@wolox.com.ar',
    password: '$2a$10$wB9oB0/dvVeNzNvd0x3zp.k3rmNFjbbw7BC7g.4.4I2F6lcKAmSU.',
    created_at: '2018-06-28T21:30:23.984Z',
    updated_at: '2018-06-28T21:30:23.984Z'
  },
  resource: 'Users'
});


dictum.document({
  description: 'Login for users who already signed up',
  endpoint: '/users/sessions',
  method: 'POST',
  requestHeaders: {
    /* headers for endpoint */
  },
  requestPathParams: {
    /* path params for endpoint */
  },
  requestBodyParams: {
    email: 'amoragues 09@wolox.com.ar',
    password: 'password'
  },
  responseStatus: 200,
  responseHeaders: {
    authorization:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFtb3JhZ3VlcyAwOUB3b2xveC5jb20uYXIifQ.0r8PA79BYDYwnWxyBmDWupb_g5C3EqmM5LQl9XbBQhQ',
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': 240,
    ETag: 'W/"f0-PQu1yuTRF+ZUXJqkEVC9NF5Z9L8"',
    Date: 'Fri, 29 Jun 2018 20:32:51 GMT',
    Connection: 'keep-alive'
  },
  responseBody: {
    id: 20,
    firstName: 'asddas',
    lastName: 'value2',
    email: 'amoragues 09@wolox.com.ar',
    password: '$2a$10$wB9oB0/dvVeNzNvd0x3zp.k3rmNFjbbw7BC7g.4.4I2F6lcKAmSU.',
    created_at: '2018-06-28T21:30:23.984Z',
    updated_at: '2018-06-28T21:30:23.984Z'
  },
  resource: 'Users'
});
