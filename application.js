const urljoin = require('url-join');
const isPlainObject = require('lodash.isplainobject');
const assert = require('assert');
const verbose = require('debug')('flowd:application:verbose');

module.exports = class Application {
  constructor(base, routes, paramHandler = null) {
    assert(isPlainObject(routes), `Expecting route to be an object instead got ${typeof routes}.`);
    this.base = base;
    this.routes = routes;
    this.paramHandler = paramHandler;
  }

  attachRoutes(router) {
    this.routes.forEach((method, endpoint) => {
      assert(this[method], `Method ${method} does not exists in ${this.constructor.name}`);

      const [verb, path] = endpoint.split(' ');
      const resolved = urljoin(this.base, path);

      verbose(`Attaching route ${verb} ${resolved} to ${this.constructor.name}.${method}`);
      router[verb.toLowerCase()](resolved, this[method].bind(this));
    });
    return router;
  }

  attachParamHandlers(router) {
    this.paramHandler.forEach((method, param) => {
      verbose(`Attaching parameter handler '${param}'.`);
      router.param(param, (val, ctx, next) => {
        method(val).then((result) => {
          ctx[param] = result;
          next();
        })
          .catch(err => {
            throw err;
          })
      })
    });
    return router;
  }
};