/* wtf-plugin-category 0.1.0  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('https')) :
  typeof define === 'function' && define.amd ? define(['https'], factory) :
  (global = global || self, global.wtf = factory(global.https));
}(this, (function (https) { 'use strict';

  https = https && Object.prototype.hasOwnProperty.call(https, 'default') ? https['default'] : https;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  /* slow 1.1.0 MIT */
  //only do foo promises at a time.
  var rateLimit = function rateLimit(arr, fn) {
    var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
    return new Promise(function (resolve, reject) {
      //some validation
      if (!arr || !fn) {
        reject('Error: missing required parameters to rate-limit function');
        return;
      }

      if (arr.length === 0) {
        resolve([]);
        return;
      }

      var results = [];
      var n = limit - 1;
      var pending = 0; //simple recursion, but with then/finally

      var go = function go(i) {
        pending += 1;
        var p = fn(arr[i]);

        if (!p.then) {
          reject('Error: function must return a promise');
          return;
        }

        p.then(function (r) {
          results[i] = r;
        });
        p["catch"](function (e) {
          console.error(e);
          results[i] = null;
        });
        p["finally"](function () {
          pending -= 1;
          n += 1; //should we keep going?

          if (arr.length >= n + 1) {
            go(n);
          } else if (pending <= 0) {
            //no more to start - are we the last to finish?
            resolve(results);
          }
        });
      }; //fire-off first-n items


      var init = arr.length < limit ? arr.length : limit;

      for (var i = 0; i < init; i += 1) {
        go(i);
      }
    });
  };

  var rateLimit_1 = rateLimit;
  var methods = {
    one: function one(arr, fn) {
      return rateLimit_1(arr, fn, 1);
    },
    two: function two(arr, fn) {
      return rateLimit_1(arr, fn, 2);
    },
    three: function three(arr, fn) {
      return rateLimit_1(arr, fn, 3);
    },
    four: function four(arr, fn) {
      return rateLimit_1(arr, fn, 4);
    },
    five: function five(arr, fn) {
      return rateLimit_1(arr, fn, 5);
    },
    ten: function ten(arr, fn) {
      return rateLimit_1(arr, fn, 10);
    },
    fifteen: function fifteen(arr, fn) {
      return rateLimit_1(arr, fn, 15);
    }
  };
  methods.serial = methods.one;
  methods.linear = methods.one;
  methods.crawl = methods.three;
  methods.walk = methods.five;
  methods.run = methods.ten;
  methods.sprint = methods.fifteen;
  var src = methods;

  var slow = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': src
  });

  var request = function request(url) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Promise(function (resolve, reject) {
      https.get(url, opts, function (resp) {
        var data = ''; // A chunk of data has been recieved.

        resp.on('data', function (chunk) {
          data += chunk;
        }); // The whole response has been received. Print out the result.

        resp.on('end', function () {
          try {
            var json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', function (err) {
        reject(err);
      });
    });
  };

  var _http = request;

  var makeHeaders = function makeHeaders(options) {
    var agent = options.userAgent || options['User-Agent'] || options['Api-User-Agent'] || 'User of the wtf_wikipedia library';
    var opts = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Api-User-Agent': agent,
        'User-Agent': agent,
        Origin: '*'
      },
      redirect: 'follow'
    };
    return opts;
  };

  var _headers = makeHeaders;

  var defaults = {
    lang: 'en',
    wiki: 'wikipedia',
    domain: null,
    path: 'w/api.php' //some 3rd party sites use a weird path

  };

  var isObject = function isObject(obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Object]';
  };

  var fetchRandom = function fetchRandom(lang, options) {
    options = options || {};
    options = Object.assign({}, defaults, options); //support lang 2nd param

    if (typeof lang === 'string') {
      options.lang = lang;
    } else if (isObject(lang)) {
      options = Object.assign(options, lang);
    }

    var url = "https://".concat(options.lang, ".wikipedia.org/").concat(options.path, "?");

    if (options.domain) {
      url = "https://".concat(options.domain, "/").concat(options.path, "?");
    }

    url += "format=json&action=query&generator=random&grnnamespace=14&prop=revisions&grnlimit=1&origin=*";
    var headers = _headers(options);
    return _http(url, headers).then(function (res) {
      try {
        var o = res.query.pages;
        var key = Object.keys(o)[0];
        return o[key].title;
      } catch (e) {
        throw e;
      }
    })["catch"](function (e) {
      console.error(e);
      return null;
    });
  };

  var random = fetchRandom;

  function getCjsExportFromNamespace (n) {
  	return n && n['default'] || n;
  }

  var slow$1 = getCjsExportFromNamespace(slow);

  var chunkBy = function chunkBy(arr) {
    var chunkSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
    var groups = [],
        i;

    for (i = 0; i < arr.length; i += chunkSize) {
      groups.push(arr.slice(i, i + chunkSize));
    }

    return groups;
  };

  var fetchCat = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(wtf, cat, lang, opts) {
      var resp, pages, groups, doit;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (cat) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", {
                docs: [],
                categories: []
              });

            case 2:
              _context.next = 4;
              return wtf.category(cat, lang);

            case 4:
              resp = _context.sent;
              pages = resp.pages.map(function (o) {
                return o.title;
              });
              groups = chunkBy(pages);

              doit = function doit(group) {
                return wtf.fetch(group, opts); //returns a promise
              }; //only allow three requests at a time


              return _context.abrupt("return", slow$1.three(groups, doit).then(function (responses) {
                //flatten the results
                var docs = [].concat.apply([], responses);
                return {
                  docs: docs,
                  categories: resp.categories
                };
              }));

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function fetchCat(_x, _x2, _x3, _x4) {
      return _ref.apply(this, arguments);
    };
  }();

  var plugin = function plugin(models) {
    models.wtf.parseCategory = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(cat, lang, opts) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return fetchCat(models.wtf, cat, lang, opts);

              case 2:
                return _context2.abrupt("return", _context2.sent);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x5, _x6, _x7) {
        return _ref2.apply(this, arguments);
      };
    }();

    models.wtf.randomCategory = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(lang, opts) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return random(lang, opts);

              case 2:
                return _context3.abrupt("return", _context3.sent);

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x8, _x9) {
        return _ref3.apply(this, arguments);
      };
    }();

    models.wtf.fetchCategory = models.wtf.parseCategory;
  };

  var src$1 = plugin;

  return src$1;

})));
//# sourceMappingURL=wtf-plugin-category.js.map
