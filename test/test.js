const test = require('ava');
const supertest = require('supertest');
const Server = require('./../server');

const User = require('./helper/user');
const Comment = require('./helper/comment');
const request = supertest('http://localhost:8080');

const server = new Server();
server.addMiddleware((ctx, next) => {
  ctx.set('Extra-Field', 'hello');
  next();
});

server.addApplication(User);
server.addApplication(Comment);

server.start();

test('Simple Request', t =>
  request
    .get('/v1/users')
    .expect(200)
    .expect(res => t.deepEqual(res.body, ['djansyle', 'djans', 'dj'])));

test('URL Parameters', t =>
  request
    .get('/v1/users/1')
    .expect(200)
    .expect(res => t.is(res.body.user, 'djansyle')));

test('Other Application', t =>
  request
    .get('/v1/comments/1')
    .expect(200)
    .expect(res => t.is(res.body.content, 'hello')));

test('Middleware', t => {
  request
    .get('/v1/users')
    .expect('Extra-Field', 'hello');

  t.pass();
});