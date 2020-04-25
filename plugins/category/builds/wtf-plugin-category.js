/* wtf-plugin-category 0.3.0  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.wtfCategory = factory());
}(this, (function () { 'use strict';

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

  var defaults = {
    lang: 'en',
    wiki: 'wikipedia',
    domain: null,
    path: 'w/api.php' //some 3rd party sites use a weird path

  };

  var isObject = function isObject(obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Object]';
  };

  var fetchRandom = function fetchRandom(lang, options, http) {
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
    return http(url).then(function (res) {
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

  var fetchCat = function fetchCat(wtf, cat, lang, opts) {
    if (!cat) {
      return {
        docs: [],
        categories: []
      };
    }

    return wtf.category(cat, lang).then(function (resp) {
      var pages = resp.pages.map(function (o) {
        return o.title;
      });
      var groups = chunkBy(pages);

      var doit = function doit(group) {
        return wtf.fetch(group, opts); //returns a promise
      }; //only allow three requests at a time


      return slow$1.three(groups, doit).then(function (responses) {
        //flatten the results
        var docs = [].concat.apply([], responses);
        return {
          docs: docs,
          categories: resp.categories
        };
      });
    });
  };

  var plugin = function plugin(models) {
    models.wtf.parseCategory = function (cat, lang, opts) {
      return fetchCat(models.wtf, cat, lang, opts);
    };

    models.wtf.randomCategory = function (lang, opts) {
      return random(lang, opts, models.http);
    };

    models.wtf.fetchCategory = models.wtf.parseCategory;
  };

  var src$1 = plugin;

  return src$1;

})));
//# sourceMappingURL=wtf-plugin-category.js.map
