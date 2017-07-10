const Application = require('./../../application');

module.exports = class CommentApplication extends Application {
  constructor(router) {
    super('/v1/comments', router);

    this.routes = {
      'GET /:comment': 'comment'
    };

    this.paramHandler = {
      'comment': (val) => Promise.resolve(['hello', 'world'][parseInt(val, 0)])
    };
  }

  comment(ctx) {
    ctx.body = {
      content: 'hello'
    };
  }
};
