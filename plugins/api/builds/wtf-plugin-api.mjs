/* wtf-plugin-api 2.0.0  MIT */
/**
 * factory for header options
 *
 * @private
 * @param {object} options
 * @returns {object} the generated options
 */
const makeHeaders = function (options) {
  let agent =
    options.userAgent || options['User-Agent'] || options['Api-User-Agent'] || 'User of the wtf_wikipedia library';

  let origin;
  if (options.noOrigin) {
    origin = '';
  } else {
    origin = options.origin || options.Origin || '*';
  }

  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Api-User-Agent': agent,
      'User-Agent': agent,
      Origin: origin,
      'Accept-Encoding': 'gzip',
    },
    redirect: 'follow',
  }
};

function normalize(title = '') {
  title = title.replace(/ /g, '_');
  title = title.trim();
  title = encodeURIComponent(title);
  return title
}

const defaults = {
  lang: 'en',
  path: 'w/api.php'
};

function toUrlParams(obj) {
  let arr = Object.entries(obj).map(([key, value]) => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  });
  return arr.join('&')
}

function fetchOne(url, options, http, prop) {
  const headers = makeHeaders(options);
  return http(url, headers).then((res) => {
    let pages = Object.keys(res.query.pages || {});
    if (pages.length === 0) {
      return { pages: [], cursor: null }
    }
    return {
      pages: res.query.pages[pages[0]][prop] || [],
      cursor: res.continue
    }
  })
}

const params$6 = {
  action: 'query',
  rdnamespace: 0,
  prop: 'redirects',
  rdlimit: 500,
  format: 'json',
  origin: '*',
  redirects: true
};

const makeUrl$5 = function (title, options, append) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`;
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`;
  }
  url += toUrlParams(params$6);
  url += `&titles=${normalize(title)}`;
  if (append) {
    url += append;
  }
  return url
};

const getRedirects = async function (title, options, http) {
  options = { ...defaults, ...options };
  let list = [];
  let getMore = true;
  let append = '';
  while (getMore) {
    let url = makeUrl$5(title, options, append);
    let { pages, cursor } = await fetchOne(url, options, http, 'redirects');
    list = list.concat(pages);
    if (cursor && cursor.rdcontinue) {
      append = '&rdcontinue=' + cursor.lhcontinue;
    } else {
      getMore = false;
    }
  }
  return list
};

const params$5 = {
  action: 'query',
  lhnamespace: 0,
  prop: 'linkshere',
  lhshow: '!redirect',
  lhlimit: 500,
  format: 'json',
  origin: '*',
  redirects: true
};

const makeUrl$4 = function (title, options, append) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`;
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`;
  }
  url += toUrlParams(params$5);
  url += `&titles=${normalize(title)}`;
  if (append) {
    url += append;
  }
  return url
};

const getIncoming = async function (title, options, http) {
  options = { ...defaults, ...options };
  let list = [];
  let getMore = true;
  let append = '';
  while (getMore) {
    let url = makeUrl$4(title, options, append);
    let { pages, cursor } = await fetchOne(url, options, http, 'linkshere');
    list = list.concat(pages);
    if (cursor && cursor.lhcontinue) {
      append = '&lhcontinue=' + cursor.lhcontinue;
    } else {
      getMore = false;
    }
  }
  return list
};

const params$4 = {
  action: 'query',
  prop: 'pageviews',
  format: 'json',
  origin: '*',
  redirects: true
};

const makeUrl$3 = function (title, options, append) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`;
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`;
  }
  url += toUrlParams(params$4);
  url += `&titles=${normalize(title)}`;
  if (append) {
    url += append;
  }
  return url
};

const getPageViews = function (doc, options, http) {
  options = { ...defaults, ...options };
  let url = makeUrl$3(doc.title(), options);
  const headers = makeHeaders(options);
  return http(url, headers).then((res) => {
    let pages = Object.keys(res.query.pages || {});
    if (pages.length === 0) {
      return []
    }
    return res.query.pages[pages[0]].pageviews || []
  })
};

const params$3 = {
  action: 'query',
  tinamespace: 0,
  prop: 'transcludedin',
  tilimit: 500,
  format: 'json',
  origin: '*',
  redirects: true
};

const makeUrl$2 = function (title, options, append) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`;
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`;
  }
  url += toUrlParams(params$3);
  url += `&titles=${normalize(title)}`;
  // support custom cursor params
  if (append) {
    url += append;
  }
  return url
};

// fetch all the pages that use a specific template
const getTransclusions = async function (template, _options, http) {
  let options = { ...defaults, ..._options };
  let list = [];
  let getMore = true;
  let append = '';
  while (getMore) {
    let url = makeUrl$2(template, options, append);
    let { pages, cursor } = await fetchOne(url, options, http, 'transcludedin');
    list = list.concat(pages);
    if (cursor && cursor.ticontinue) {
      append = '&ticontinue=' + cursor.ticontinue;
    } else {
      getMore = false;
    }
  }
  return list
};

const params$2 = {
  action: 'query',
  list: 'categorymembers',
  cmlimit: 500,
  cmtype: 'page|subcat',
  cmnamespace: '0|14',
  format: 'json',
  origin: '*',
  redirects: true
};

const fetchIt$1 = function (url, options, http, prop) {
  const headers = makeHeaders(options);
  return http(url, headers).then((res) => {
    let pages = Object.keys(res.query[prop] || {});
    if (pages.length === 0) {
      return { pages: [], cursor: null }
    }
    let arr = pages.map((k) => res.query[prop][k]);
    return {
      pages: arr,
      cursor: res.continue
    }
  })
};

const makeUrl$1 = function (title, options, append) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`;
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`;
  }
  url += toUrlParams(params$2);
  if (/^Category/i.test(title) === false) {
    title = 'Category:' + title;
  }
  url += `&cmtitle=${normalize(title)}`;
  url += `&cmprop=ids|title|type`;
  if (append) {
    url += append;
  }
  return url
};

const getOneCategory = async function (title, options, http) {
  let list = [];
  let getMore = true;
  let append = '';
  while (getMore) {
    let url = makeUrl$1(title, options, append);
    let { pages, cursor } = await fetchIt$1(url, options, http, 'categorymembers');
    list = list.concat(pages);
    if (cursor && cursor.cmcontinue) {
      append = '&cmcontinue=' + cursor.cmcontinue;
    } else {
      getMore = false;
    }
  }
  return list
};

async function getCategoriesRecursively(
  title,
  options,
  exclusions,
  maxDepth,
  currentDepth,
  pagesSeen,
  http
) {
  let results = await getOneCategory(title, options, http);
  //check if we should recur - either if maxDepth not set or if we're not going to exceed it in this recursion
  if (maxDepth === undefined || currentDepth < maxDepth) {
    let categories = results.filter((entry) => entry.type === 'subcat');
    if (exclusions) {
      categories = categories.filter((category) => !exclusions.includes(category.title));
    }
    //prevent infinite loops by discarding any subcats we've already seen
    categories = categories.filter((category) => !pagesSeen.includes(category.title));
    pagesSeen.push(...categories.map((category) => category.title));
    const subCatResults = [];
    for (let category of categories) {
      let subCatResult = await getCategoriesRecursively(
        category.title,
        options,
        exclusions,
        maxDepth,
        currentDepth + 1,
        pagesSeen,
        http
      );
      subCatResults.push(subCatResult);
    }
    return results.concat(...subCatResults)
  } else {
    return results
  }
}

async function getCategory(title, options, http) {
  options = { ...defaults, ...options };
  let exclusions = options?.categoryExclusions;
  let recursive = options?.recursive === true;
  let maxDepth = options?.maxDepth;
  if (recursive) {
    return await getCategoriesRecursively(title, options, exclusions, maxDepth, 0, [], http)
  } else {
    return await getOneCategory(title, options, http)
  }
}

const params$1 = {
  action: 'query',
  generator: 'random',
  grnnamespace: '0',
  prop: 'revisions',
  rvprop: 'content',
  grnlimit: '1',
  rvslots: 'main',
  format: 'json',
  origin: '*',
  redirects: 'true'
};

const fetchIt = function (url, options, http) {
  const headers = makeHeaders(options);
  return http(url, headers).then((res) => {
    let pages = Object.keys(res.query.pages || {});
    if (pages.length === 0) {
      return { pages: [], cursor: null }
    }
    return res.query.pages[pages[0]]
  })
};

const makeUrl = function (options) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`;
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`;
  }
  url += toUrlParams(params$1);
  return url
};

const getRandom = async function (_options, http, wtf) {
  let options = { ...defaults, ..._options };
  let url = makeUrl(options);
  let page = {};
  try {
    page = await fetchIt(url, options, http) || {};
  } catch (e) {
    console.error(e);
  }
  let title = page.title;
  let wiki = '';
  if (page.revisions && page.revisions[0] && page.revisions[0].slots) {
    wiki = page.revisions[0].slots.main['*'] || '';
  }
  let doc = wtf(wiki, { title });
  return doc
};

const params = {
  format: 'json',
  action: 'query',
  generator: 'random',
  grnnamespace: 14,
  prop: 'revisions',
  grnlimit: 1,
  origin: '*'
};

const randomCategory = function (options = {}, http) {
  options = Object.assign({}, defaults, options);
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`;
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`;
  }
  url += toUrlParams(params);
  const headers = makeHeaders(options);
  return http(url, headers)
    .then((res) => {
      try {
        let o = res.query.pages;
        let key = Object.keys(o)[0];
        return o[key].title
      } catch (e) {
        throw e
      }
    })
    .catch((e) => {
      console.error(e);
      return null
    })
};

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

const isObject = function (obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]'
};

const chunkBy = function (arr, chunkSize = 5) {
  let groups = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    groups.push(arr.slice(i, i + chunkSize));
  }
  return groups
};

const fetchList = function (pages, options, wtf) {
  // support a list of strings, or objects
  if (pages[0] && isObject(pages[0])) {
    pages = pages.map((o) => o.title);
  }
  // fetch in groups of 5
  let groups = chunkBy(pages);

  const doit = function (group) {
    return wtf.fetch(group, options) //returns a promise
  };
  //only allow three requests at a time
  return src.three(groups, doit).then((res) => {
    // flatten into one list
    return res.reduce((arr, a) => {
      arr = arr.concat(a);
      return arr
    })
  })
};

const addMethod = function (models) {
  // doc methods
  models.Doc.prototype.getRedirects = function () {
    return getRedirects(this.title(), this.options(), models.http)
  };
  models.Doc.prototype.getIncoming = function () {
    return getIncoming(this.title(), this.options(), models.http)
  };
  models.Doc.prototype.getPageViews = function () {
    return getPageViews(this, this.options(), models.http)
  };

  // constructor methods
  models.wtf.getRandomPage = function (options) {
    return getRandom(options, models.http, models.wtf)
  };
  models.wtf.getRandomCategory = function (options) {
    return randomCategory(options, models.http)
  };
  models.wtf.getTemplatePages = function (template, options) {
    return getTransclusions(template, options, models.http)
  };
  models.wtf.getCategoryPages = function (category, options) {
    return getCategory(category, options, models.http)
  };
  models.wtf.fetchList = function (list, options) {
    return fetchList(list, options, models.wtf)
  };
  models.wtf.getIncoming = function (title, options) {
    return getIncoming(title, options, models.http)
  };
  models.wtf.getRedirects = function (title, options) {
    return getRedirects(title, options, models.http)
  };
  // aliases
  models.wtf.random = models.wtf.getRandomPage;
};

export { addMethod as default };
