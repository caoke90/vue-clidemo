
/**
 * Module dependencies.
 */

var toRegexp = require('path-to-regexp');
var URL = require('url');

/**
 * Expose `expose`.
 */



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

const proxyMiddleware = require('http-proxy-middleware');
const path = require('path');
const mockArr = require("./rewrite.js");
const mockUrl = {}
mockArr.forEach(function(item) {
  Object.assign(mockUrl, item)
})
var bodyParser = require('body-parser');


const list = []
if(mockArr.length) {
  var urlMock = mockArr[0]
  Object.keys(urlMock).forEach(function(url) {
    var mock = urlMock[url];
    list.push({
      key: url,
      value: mock,
    })
  })
}
const fs = require("fs")


module.exports=function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  Object.keys(mockUrl).forEach(function(url) {
    var mock = mockUrl[url];

    if(/^http:/.test(mock)) {

      var options = {
        target: mock.replace(/(http:\/\/[^/]+)\/.+/, "$1"),
        changeOrigin: true,
        pathRewrite: {}
      };
      options.pathRewrite[url] = mock.replace(/http:\/\/[^/]+\//, "/")
      app.use(proxyMiddleware(options.filter || url, options));
    } else {
      var filepath = path.join(__dirname, "../mock" + mock)
      if(fs.existsSync(filepath)) {
        app.use(url, function(req, res, next) {
          res.jsonp(JSON.parse(fs.readFileSync(filepath).toString()))
        });
      } else {
        app.use(rewrite(url, mock));
      }

    }

  });
}


