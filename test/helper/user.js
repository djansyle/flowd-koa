const Application = require('./../../application');

const routes = {
  'GET /': 'users',
  'GET /:user': 'user'
};

const paramHandler = {
  'user': (val) => new Promise(resolve => {
    resolve({
      1: 'djansyle',
      2: 'dj',
      3: 'djans'
    }[parseInt(val, 0)]);
  }),

};

class UserApplication extends Application {
  constructor() {
    super('/v1/users', routes, paramHandler);
  }

  users(ctx) {
    ctx.body = ['djansyle', 'djans', 'dj'];
  }

  user(ctx) {
    ctx.body = {
      user: ctx.user
    };
  }
}

module.exports = UserApplication;
