
/**
 * Module dependencies.
 */

var toRegexp = require('path-to-regexp');
var URL = require('url');

/**
 * Expose `expose`.
 */

module.exports = rewrite;

/**
 * Rewrite `src` to `dst`.
 *
 * @param {String|RegExp} src
 * @param {String} dst
 * @return {Function}
 * @api public
 */

function rewrite(src, dst) {
  var keys = [], re, map;

  if (dst) {
    re = toRegexp(src, keys);
    map = toMap(keys);
  } else {
  }

  return function(req, res, next) {
    var orig = req.url;
    var m;
    if (dst) {
      m = re.exec(orig);
      if (!m) {
        return next();
      }
    }
    req.url = req.originalUrl = (dst || src).replace(/\$(\d+)|(?::(\w+))/g, function(_, n, name) {
      if (name) {
        if (m) return m[map[name].index + 1];
        else return req.params[name];
      } else if (m) {
        return m[n];
      } else {
        return req.params[n];
      }
    });
    if (req.url.indexOf('?') > 0) {
      req.query = URL.parse(req.url, true).query;
    }
    if (dst) next();
    else next('route');
  }
}

/**
 * Turn params array into a map for quick lookup.
 *
 * @param {Array} params
 * @return {Object}
 * @api private
 */

function toMap(params) {
  var map = {};

  params.forEach(function(param, i) {
    param.index = i;
    map[param.name] = param;
  });

  return map;
}
