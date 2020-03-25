/* wtf-plugin-category 0.0.1  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('slow')) :
  typeof define === 'function' && define.amd ? define(['slow'], factory) :
  (global = global || self, global.wtf = factory(global.slow));
}(this, (function (slow) { 'use strict';

  slow = slow && Object.prototype.hasOwnProperty.call(slow, 'default') ? slow['default'] : slow;

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
              _context.next = 2;
              return wtf.category(cat, lang);

            case 2:
              resp = _context.sent;
              pages = resp.pages.map(function (o) {
                return o.title;
              });
              groups = chunkBy(pages);

              doit = function doit(group) {
                return wtf.fetch(group, opts); //returns a promise
              }; //only allow three requests at a time


              return _context.abrupt("return", slow.three(groups, doit).then(function (responses) {
                //flatten the results
                var docs = [].concat.apply([], responses);
                return {
                  docs: docs,
                  categories: resp.categories
                };
              }));

            case 7:
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

    models.wtf.fetchCategory = models.wtf.parseCategory;
  };

  var src = plugin;

  return src;

})));
//# sourceMappingURL=wtf-plugin-category.js.map
