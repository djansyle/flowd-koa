const Application = require('./../../application');

class UserApplication extends Application {
  constructor() {
    super('/v1/users');

    this.routes = {
      'GET /': 'users',
      'GET /:user': 'user'
    };
    
    this.paramHandler = {
      'user': (val) => Promise.resolve({
        1: 'djansyle',
        2: 'dj',
        3: 'djans'
      }[parseInt(val, 0)])
    };
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
