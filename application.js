const urljoin = require('url-join');
const forEach = require('lodash.foreach');
const isPlainObject = require('lodash.isplainobject');
const assert = require('assert');
const verbose = require('debug')('flowd:application:verbose');
const resthen = require('resthen');

module.exports = class Application {
  constructor(base, routes, paramHandler = null) {
    assert(isPlainObject(routes), `Expecting route to be an object instead got ${typeof routes}.`);
    this.base = base;
    this.routes = routes;
    this.paramHandler = paramHandler;
  }

  attachRoutes(router) {
    forEach(this.routes, (method, endpoint) => {
      assert(this[method], `Method ${method} does not exists in ${this.constructor.name}`);

      const [verb, path] = endpoint.split(' ');
      const resolved = urljoin(this.base, path);

      verbose(`Attaching route ${verb} ${resolved} to ${this.constructor.name}.${method}`);
      router[verb.toLowerCase()](resolved, this[method].bind(this));
    });
    return router;
  }

  attachParamHandlers(router) {
    if (!this.paramHandler) {
      return ;
    }

    forEach(this.paramHandler, (method, param) => {
      verbose(`Attaching parameter handler '${param}'.`);
      router.param(param, (val, ctx, next) => {
        return resthen(method(val), (err, res) => {
          if (err) {
            throw err;
          }

          ctx[param] = res;
          next();
        });
      });
    });
    return router;
  }
};