const Koa = require('koa');
const Router = require('koa-router');
const compose = require('koa-compose');
const debug = require('debug');

const verbose = debug('flowd:server:verbose');
const info = debug('flowd:server:info');

module.exports = class Server {
  constructor(middlewares = [], applications = [], host = '127.0.0.1', port = 8080) {
    this.app = new Koa();
    this.middlewares = middlewares;
    this.applications = applications;
    this.host = host;
    this.port = port;
    this.server = null;
  }

  addMiddleware(fn) {
    verbose('Added middleware.');
    this.middlewares.push(fn);
  }

  addApplication(app) {
    verbose(`Adding ${app.name} application.`);
    this.applications.push(app);
  }

  start() {
    const app = this.app;
    const router = new Router;

    verbose('Instantiating applications.');
    this.applications.forEach(classApp => {
      const app = new classApp();
      app.attachParamHandlers(router);
      app.attachRoutes(router);
    });

    verbose('Attaching middlewares.');
    app.use(compose(this.middlewares));

    verbose('Attaching application routes.');
    app.use(router.routes());
    app.use(router.allowedMethods());

    this.server = app.listen(this.port, this.host);
    info(`Server started on ${this.host} at port ${this.port}`);
  }

  stop() {
    return new Promise(resolve => this.server.close(resolve));
  }
};
