const Application = require('./../../application');

const routes = {
  'GET /:comment': 'comment'
};
const paramHandler = {
  'comment': (val) => Promise.resolve(['hello', 'world'][parseInt(val, 0)])
};

module.exports = class CommentApplication extends Application {
  constructor() {
    super('/v1/comments', routes, paramHandler);
  }

  comment(ctx) {
    ctx.body = {
      content: 'hello'
    };
  }
};
