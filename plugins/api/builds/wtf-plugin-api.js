/* wtf-plugin-api 0.0.1  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.wtfImage = factory());
}(this, (function () { 'use strict';

  var normalize = function (title = '') {
    title = title.replace(/ /g, '_');
    title = title.trim();
    title = encodeURIComponent(title);
    return title;
  };

  var defaults = {
    lang: 'en',
    path: '/w/api.php'
  };

  var toUrlParams = function (obj) {
    let arr = Object.entries(obj).map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    });
    return arr.join('&');
  };

  var _fns = {
    normalize: normalize,
    defaults: defaults,
    toUrlParams: toUrlParams
  };

  const {
    normalize: normalize$1,
    defaults: defaults$1,
    toUrlParams: toUrlParams$1
  } = _fns;
  const params = {
    action: 'query',
    rdnamespace: 0,
    prop: 'redirects',
    rdlimit: 500,
    format: 'json',
    origin: '*',
    redirects: true
  };

  const makeUrl = function (title, options, cursor) {
    let url = `https://${options.lang}.wikipedia.org/${options.path}?`;

    if (options.domain) {
      url = `https://${options.domain}/${options.path}?`;
    }

    url += toUrlParams$1(params);
    url += `&titles=${normalize$1(title)}`;

    if (cursor) {
      url += '&rdcontinue=' + cursor;
    }

    return url;
  };

  const getRedirects = function (doc, http) {
    let url = makeUrl(doc.title(), defaults$1);
    return http(url).then(res => {
      let pages = Object.keys(res.query.pages || {});

      if (pages.length === 0) {
        return [];
      }

      return res.query.pages[pages[0]].redirects || [];
    });
  };

  var getRedirects_1 = getRedirects;

  const {
    normalize: normalize$2,
    defaults: defaults$2,
    toUrlParams: toUrlParams$2
  } = _fns;
  const params$1 = {
    action: 'query',
    lhnamespace: 0,
    prop: 'linkshere',
    lhshow: '!redirect',
    lhlimit: 500,
    format: 'json',
    origin: '*',
    redirects: true
  };

  const makeUrl$1 = function (title, options, cursor) {
    let url = `https://${options.lang}.wikipedia.org/${options.path}?`;

    if (options.domain) {
      url = `https://${options.domain}/${options.path}?`;
    }

    url += toUrlParams$2(params$1);
    url += `&titles=${normalize$2(title)}`;

    if (cursor) {
      url += '&lhcontinue=' + cursor;
    }

    return url;
  };

  const getIncoming = function (doc, http) {
    let url = makeUrl$1(doc.title(), defaults$2);
    return http(url).then(res => {
      let pages = Object.keys(res.query.pages || {});

      if (pages.length === 0) {
        return [];
      }

      return res.query.pages[pages[0]].linkshere || [];
    });
  };

  var getIncoming_1 = getIncoming;

  const {
    normalize: normalize$3,
    defaults: defaults$3,
    toUrlParams: toUrlParams$3
  } = _fns;
  const params$2 = {
    action: 'query',
    prop: 'pageviews',
    format: 'json',
    origin: '*',
    redirects: true
  };

  const makeUrl$2 = function (title, options, cursor) {
    let url = `https://${options.lang}.wikipedia.org/${options.path}?`;

    if (options.domain) {
      url = `https://${options.domain}/${options.path}?`;
    }

    url += toUrlParams$3(params$2);
    url += `&titles=${normalize$3(title)}`;

    if (cursor) {
      url += '&rdcontinue=' + cursor;
    }

    return url;
  };

  const getPageViews = function (doc, http) {
    let url = makeUrl$2(doc.title(), defaults$3);
    return http(url).then(res => {
      let pages = Object.keys(res.query.pages || {});

      if (pages.length === 0) {
        return [];
      }

      return res.query.pages[pages[0]].pageviews || [];
    });
  };

  var getPageViews_1 = getPageViews;

  const {
    normalize: normalize$4,
    defaults: defaults$4,
    toUrlParams: toUrlParams$4
  } = _fns;
  const params$3 = {
    action: 'query',
    tinamespace: 0,
    prop: 'transcludedin',
    tilimit: 500,
    format: 'json',
    origin: '*',
    redirects: true
  };

  const makeUrl$3 = function (title, options, cursor) {
    let url = `https://${options.lang}.wikipedia.org/${options.path}?`;

    if (options.domain) {
      url = `https://${options.domain}/${options.path}?`;
    }

    url += toUrlParams$4(params$3);
    url += `&titles=${normalize$4(title)}`;

    if (cursor) {
      url += '&ticontinue=' + cursor;
    }

    return url;
  }; // fetch all the pages that use a specific template


  const getTransclusions = function (template, _options, http) {
    let url = makeUrl$3(template, defaults$4);
    return http(url).then(res => {
      let pages = Object.keys(res.query.pages || {});

      if (pages.length === 0) {
        return [];
      }

      return res.query.pages[pages[0]].transcludedin || [];
    });
  };

  var getTransclusions_1 = getTransclusions;

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

  function getCjsExportFromNamespace (n) {
  	return n && n['default'] || n;
  }

  var slow$1 = getCjsExportFromNamespace(slow);

  const chunkBy = function (arr, chunkSize = 5) {
    let groups = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
      groups.push(arr.slice(i, i + chunkSize));
    }

    return groups;
  };

  const fetchCat = function (cat, options = {}, wtf) {
    if (!cat) {
      return {
        docs: [],
        categories: []
      };
    }

    return wtf.category(cat, options.lang).then(resp => {
      let pages = resp.pages.map(o => o.title);
      let groups = chunkBy(pages);

      const doit = function (group) {
        return wtf.fetch(group, options); //returns a promise
      }; //only allow three requests at a time


      return slow$1.three(groups, doit).then(responses => {
        //flatten the results
        let docs = [].concat.apply([], responses);
        return {
          docs: docs,
          categories: resp.categories
        };
      });
    });
  };

  var getCategory = fetchCat;

  const {
    defaults: defaults$5,
    toUrlParams: toUrlParams$5
  } = _fns;
  const params$4 = {
    format: 'json',
    action: 'query',
    generator: 'random',
    grnnamespace: 14,
    prop: 'revisions',
    grnlimit: 1,
    origin: '*'
  };

  const randomCategory = function (options = {}, http) {
    options = Object.assign({}, defaults$5, options);
    let url = `https://${options.lang}.wikipedia.org/${options.path}?`;

    if (options.domain) {
      url = `https://${options.domain}/${options.path}?`;
    }

    url += toUrlParams$5(params$4);
    return http(url).then(res => {
      try {
        let o = res.query.pages;
        let key = Object.keys(o)[0];
        return o[key].title;
      } catch (e) {
        throw e;
      }
    }).catch(e => {
      console.error(e);
      return null;
    });
  };

  var getRandomCategory = randomCategory;

  const isObject = function (obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Object]';
  };

  const chunkBy$1 = function (arr, chunkSize = 5) {
    let groups = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
      groups.push(arr.slice(i, i + chunkSize));
    }

    return groups;
  };

  const fetchList = function (pages, options, wtf) {
    // support a list of strings, or objects
    if (pages[0] && isObject(pages[0])) {
      pages = pages.map(o => o.title);
    } // fetch in groups of 5


    let groups = chunkBy$1(pages);

    const doit = function (group) {
      return wtf.fetch(group, options); //returns a promise
    }; //only allow three requests at a time


    return slow$1.three(groups, doit).then(res => {
      // flatten into one list
      return res.reduce((arr, a) => {
        arr = arr.concat(a);
        return arr;
      });
    });
  };

  var fetchList_1 = fetchList;

  const addMethod = function (models) {
    // doc methods
    models.Doc.prototype.getRedirects = function () {
      return getRedirects_1(this, models.http);
    };

    models.Doc.prototype.getIncoming = function () {
      return getIncoming_1(this, models.http);
    };

    models.Doc.prototype.getPageViews = function () {
      return getPageViews_1(this, models.http);
    }; // constructor methods


    models.wtf.getRandomCategory = function (options) {
      return getRandomCategory(options, models.http);
    };

    models.wtf.getTemplatePages = function (template, options) {
      return getTransclusions_1(template, options, models.http);
    };

    models.wtf.getCategoryPages = function (category, options) {
      return getCategory(category, options, models.wtf);
    };

    models.wtf.fetchList = function (list, options) {
      return fetchList_1(list, options, models.wtf);
    };
  };

  var src$1 = addMethod;

  return src$1;

})));
//# sourceMappingURL=wtf-plugin-api.js.map
