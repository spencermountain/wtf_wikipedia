/*! wtf-plugin-api 2.0.1 MIT */
var version = '2.0.1';

/* eslint-disable no-console */
// fetch + parse a json response from the mediawiki api.
// failures warn to the console and resolve to {}
const hints = {
  403: 'wikimedia blocks generic user-agents - set an Api-User-Agent option with contact-info',
  429: 'wikimedia wants you to slow down - run requests serially, and set an Api-User-Agent option',
};

const http = function (url, headers) {
  return fetch(url, headers)
    .then((res) => {
      if (res.ok !== true) {
        let msg = `wtf-plugin-api: http-${res.status} error from the wikimedia api`;
        if (hints[res.status]) {
          msg += `\n  → ${hints[res.status]}`;
        }
        console.warn(msg);
        return {}
      }
      return res.json()
    })
    .catch((e) => {
      console.warn(`wtf-plugin-api: request failed - ${e.message}`);
      return {}
    })
};

/**
 * factory for header options
 *
 * @private
 * @param {object} options
 * @returns {object} the generated options
 */
const makeHeaders = function (options) {
  const agent =
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
  title = title.trim();
  title = title.replace(/ /g, '_');
  title = encodeURIComponent(title);
  return title
}

const defaults = {
  lang: 'en',
  path: 'w/api.php',
};

const isWikimedia = /(wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikispecies|wikiversity|wikivoyage|wiktionary)\.org$/;
const isBare = /^(wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikispecies|wikiversity|wikivoyage|wiktionary)\.org$/;

// the api's base-url. a fetched doc's options() store a bare project
// domain like 'wikipedia.org' + path 'api.php' - neither is usable alone
function apiBase(options) {
  let { lang, domain, path } = options;
  if (domain && isBare.test(domain) && lang) {
    domain = `${lang}.${domain}`;
  }
  if (domain && isWikimedia.test(domain)) {
    path = 'w/api.php';
  }
  if (!domain) {
    return `https://${lang}.wikipedia.org/${path}?`
  }
  return `https://${domain}/${path}?`
}

function toUrlParams(obj) {
  const arr = Object.entries(obj).map(([key, value]) => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  });
  return arr.join('&')
}

function fetchOne(url, options, http, prop) {
  const headers = makeHeaders(options);
  return http(url, headers).then((res) => {
    const pages = Object.keys(res.query.pages || {});
    if (pages.length === 0) {
      return { pages: [], cursor: null }
    }
    return {
      pages: res.query.pages[pages[0]][prop] || [],
      cursor: res.continue,
    }
  })
}

const params$9 = {
  action: 'query',
  rdnamespace: 0,
  prop: 'redirects',
  rdlimit: 500,
  format: 'json',
  origin: '*',
  redirects: true,
};

const makeUrl$8 = function (title, options, append) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`;
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`;
  }
  url += toUrlParams(params$9);
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
    const url = makeUrl$8(title, options, append);
    const { pages, cursor } = await fetchOne(url, options, http, 'redirects');
    list = list.concat(pages);
    if (cursor && cursor.rdcontinue) {
      append = '&rdcontinue=' + cursor.rdcontinue;
    } else {
      getMore = false;
    }
  }
  return list
};

const params$8 = {
  action: 'query',
  lhnamespace: 0,
  prop: 'linkshere',
  lhshow: '!redirect',
  lhlimit: 500,
  format: 'json',
  origin: '*',
  redirects: true
};

const makeUrl$7 = function (title, options, append) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`;
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`;
  }
  url += toUrlParams(params$8);
  url += `&titles=${normalize(title)}`;
  if (append) {
    url += append;
  }
  return url
};

const getIncoming = async function (title, options, http) {
  options = { ...defaults, ...options };
  let list = [];
  let keepGoing = true;
  let append = '';
  while (keepGoing) {
    const url = makeUrl$7(title, options, append);
    const { pages, cursor } = await fetchOne(url, options, http, 'linkshere');
    list = list.concat(pages);
    if (cursor && cursor.lhcontinue) {
      append = '&lhcontinue=' + cursor.lhcontinue;
    } else {
      keepGoing = false;
    }
  }
  return list
};

const params$7 = {
  action: 'query',
  prop: 'pageviews',
  format: 'json',
  origin: '*',
  redirects: true,
};

const makeUrl$6 = function (title, options, append) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`;
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`;
  }
  url += toUrlParams(params$7);
  url += `&titles=${normalize(title)}`;
  return url
};

const getPageViews = function (doc, options, http) {
  options = { ...defaults, ...options };
  const url = makeUrl$6(doc.title, options);
  const headers = makeHeaders(options);
  return http(url, headers).then((res) => {
    const pages = Object.keys(res.query.pages || {});
    if (pages.length === 0) {
      return []
    }
    return res.query.pages[pages[0]].pageviews || []
  })
};

const params$6 = {
  action: 'query',
  tinamespace: 0,
  prop: 'transcludedin',
  tilimit: 500,
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
  // support custom cursor params
  if (append) {
    url += append;
  }
  return url
};

// fetch all the pages that use a specific template
const getTransclusions = async function (template, _options, http) {
  const options = { ...defaults, ..._options };
  let list = [];
  let getMore = true;
  let append = '';
  while (getMore) {
    const url = makeUrl$5(template, options, append);
    const { pages, cursor } = await fetchOne(url, options, http, 'transcludedin');
    list = list.concat(pages);
    if (cursor && cursor.ticontinue) {
      append = '&ticontinue=' + cursor.ticontinue;
    } else {
      getMore = false;
    }
  }
  return list
};

const isCategory = /^(category|catégorie|kategorie|categoría|categoria|categorie|kategoria)/i;

const params$5 = {
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
    const pages = Object.keys(res.query[prop] || {});
    if (pages.length === 0) {
      return { pages: [], cursor: null }
    }
    const arr = pages.map((k) => res.query[prop][k]);
    return {
      pages: arr,
      cursor: res.continue
    }
  })
};

const makeUrl$4 = function (title, options, append) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`;
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`;
  }
  url += toUrlParams(params$5);
  if (isCategory.test(title) === false) {
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
    const url = makeUrl$4(title, options, append);
    const { pages, cursor } = await fetchIt$1(url, options, http, 'categorymembers');
    list = list.concat(pages);
    if (cursor && cursor.cmcontinue) {
      append = '&cmcontinue=' + cursor.cmcontinue;
    } else {
      getMore = false;
    }
  }
  return list
};

// eslint-disable-next-line max-params
async function getCategoriesRecursively(
  title,
  options,
  exclusions,
  maxDepth,
  currentDepth,
  pagesSeen,
  http
) {
  const results = await getOneCategory(title, options, http);
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
    for (const category of categories) {
      const subCatResult = await getCategoriesRecursively(
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
  const exclusions = options?.categoryExclusions;
  const recursive = options?.recursive === true;
  const maxDepth = options?.maxDepth;
  if (recursive) {
    return await getCategoriesRecursively(title, options, exclusions, maxDepth, 0, [], http)
  } else {
    return await getOneCategory(title, options, http)
  }
}

/* eslint-disable no-console */

const params$4 = {
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
    const pages = Object.keys(res.query.pages || {});
    if (pages.length === 0) {
      return { pages: [], cursor: null }
    }
    return res.query.pages[pages[0]]
  })
};

const makeUrl$3 = function (options) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`;
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`;
  }
  url += toUrlParams(params$4);
  return url
};

const getRandom = async function (_options, http, wtf) {
  const options = { ...defaults, ..._options };
  const url = makeUrl$3(options);
  let page = {};
  try {
    page = await fetchIt(url, options, http) || {};
  } catch (e) {
    console.error(e);
  }
  const title = page.title;
  let wiki = '';
  if (page.revisions && page.revisions[0] && page.revisions[0].slots) {
    wiki = page.revisions[0].slots.main['*'] || '';
  }
  const doc = wtf(wiki, { title });
  return doc
};

/* eslint-disable no-console */

const params$3 = {
  format: 'json',
  action: 'query',
  generator: 'random',
  grnnamespace: 14,
  prop: 'revisions',
  grnlimit: 1,
  origin: '*'
};

const randomCategory = function (options = {}, http) {
  options = { ...defaults, ...options };
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`;
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`;
  }
  url += toUrlParams(params$3);
  const headers = makeHeaders(options);
  return http(url, headers)
    .then((res) => {
      try {
        const o = res.query.pages;
        const key = Object.keys(o)[0];
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
  const groups = [];
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
  const groups = chunkBy(pages);

  const doit = function (group) {
    return wtf.fetch(group, options) //returns a promise
  };
  //only allow three requests at a time
  return src.three(groups, doit).then((res) => {
    // flatten into one list
    return res.flat()
  })
};

// the api's parse endpoint renders one page server-side
const params$2 = {
  action: 'parse',
  redirects: '1',
  format: 'json',
  formatversion: '2',
  origin: '*',
};

const makeUrl$2 = function (title, options, prop) {
  let url = apiBase(options);
  url += toUrlParams({ ...params$2, prop });
  url += `&page=${normalize(title)}`;
  return url
};

// prop is 'text' for rendered html, or 'wikitext' for the raw markup
const getParse = function (title, options, http, prop) {
  options = { ...defaults, ...options };
  const url = makeUrl$2(title, options, prop);
  const headers = makeHeaders(options);
  return http(url, headers).then((res) => {
    return res?.parse?.[prop] ?? null
  })
};

// the TextExtracts api renders a page as plaintext (prose only - tables,
// infoboxes and references are dropped by the server)
const params$1 = {
  action: 'query',
  prop: 'extracts',
  explaintext: '1',
  redirects: '1',
  format: 'json',
  formatversion: '2',
  origin: '*',
};

const makeUrl$1 = function (title, options, sections) {
  let url = apiBase(options);
  url += toUrlParams({ ...params$1, exsectionformat: sections });
  url += `&titles=${normalize(title)}`;
  return url
};

const getExtract = function (title, options, http) {
  options = { ...defaults, ...options };
  // 'wiki' keeps '== heading ==' lines, 'plain' bare text, 'raw' internal markers
  let sections = options.sections;
  if (sections !== 'plain' && sections !== 'raw') {
    sections = 'wiki';
  }
  const url = makeUrl$1(title, options, sections);
  const headers = makeHeaders(options);
  return http(url, headers).then((res) => {
    return res?.query?.pages?.[0]?.extract ?? null
  })
};

// choose a good, representative image for this page, if one exists
const mainImage = function () {
  const box = this.infobox();
  if (box) {
    const img = box.image();
    if (img) {
      return img
    }
  }
  // fallback to a lone image in the first section
  const section = this.sections()[0];
  if (section) {
    const imgs = section.images();
    if (imgs.length === 1) {
      return imgs[0]
    }
  }
  return null
};

/* eslint-disable no-bitwise, max-params, no-multi-assign */
/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */


function safeAdd(x, y) {
  const lsw = (x & 0xffff) + (y & 0xffff);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xffff)
}

function bitRotateLeft(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt))
}

function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
}
function md5ff(a, b, c, d, x, s, t) {
  return md5cmn((b & c) | (~b & d), a, b, x, s, t)
}
function md5gg(a, b, c, d, x, s, t) {
  return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
}
function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t)
}
function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t)
}

function binlMD5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  let i;
  let olda;
  let oldb;
  let oldc;
  let oldd;
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (i = 0; i < x.length; i += 16) {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;

    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }
  return [a, b, c, d]
}

function binl2rstr(input) {
  let i;
  let output = '';
  const length32 = input.length * 32;
  for (i = 0; i < length32; i += 8) {
    output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
  }
  return output
}

function rstr2binl(input) {
  let i;
  const output = [];
  output[(input.length >> 2) - 1] = undefined;
  for (i = 0; i < output.length; i += 1) {
    output[i] = 0;
  }
  const length8 = input.length * 8;
  for (i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
  }
  return output
}

function rstrMD5(s) {
  return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
}

function rstr2hex(input) {
  const hexTab = '0123456789abcdef';
  let output = '';
  let x;
  let i;
  for (i = 0; i < input.length; i += 1) {
    x = input.charCodeAt(i);
    output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
  }
  return output
}

function str2rstrUTF8(input) {
  return unescape(encodeURIComponent(input))
}

function rawMD5(s) {
  return rstrMD5(str2rstrUTF8(s))
}
function hexMD5(s) {
  return rstr2hex(rawMD5(s))
}

function md5(string, key, raw) {
  {
    {
      return hexMD5(string)
    }
  }
}

const server = 'https://upload.wikimedia.org/wikipedia/commons/';

const encodeTitle = function (file) {
  let title = file.replace(/^(image|file?):/i, '');
  title = title.trim();
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1);
  //spaces to underscores
  title = title.replace(/ /g, '_');
  return title
};

//instead of the wikimedia redirect server, generate a direct url.
//the commons image path is a little silly:
//https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F
const commonsURL = function (file) {
  let title = encodeTitle(file);
  const hash = md5(title);
  const path = hash.substring(0, 1) + '/' + hash.substring(0, 2) + '/';
  title = encodeURIComponent(title);
  return server + path + title
};

// make a HEAD request, to double-check the image url actually resolves
// returns true/false, or null when the request itself failed
const imageExists = function (url, options = {}) {
  const headers = makeHeaders(options);
  headers.method = 'HEAD';
  return fetch(url, headers)
    .then((res) => /^[23]/.test(String(res.status)))
    .catch(() => null)
};

const params = {
  action: 'query',
  prop: 'imageinfo',
  iiprop: 'extmetadata',
  format: 'json',
  origin: '*',
};

const makeUrl = function (file, options) {
  const domain = options.domain || 'commons.wikimedia.org';
  let url = `https://${domain}/${options.path}?`;
  url += toUrlParams(params);
  url += `&titles=${normalize(file)}`;
  return url
};

// pull the license fields out of an imageinfo response
const parseLicense = function (res) {
  const pages = Object.values(res.query?.pages || {});
  if (pages.length === 0 || !pages[0].imageinfo || !pages[0].imageinfo[0]) {
    return null
  }
  const meta = pages[0].imageinfo[0].extmetadata || {};
  return {
    license: meta.LicenseShortName?.value || '',
    artist: meta.Artist?.value || '',
    credit: meta.Credit?.value || '',
    attributionRequired: meta.AttributionRequired?.value || '',
  }
};

// fetch license + attribution info for an image file, from the commons API
const imageLicense = function (file, options, http) {
  options = { ...defaults, ...options };
  const url = makeUrl(file, options);
  const headers = makeHeaders(options);
  return http(url, headers).then(parseLicense)
};

const addMethod = function (models) {
  // doc methods
  models.Doc.prototype.getRedirects = function () {
    return getRedirects(this.title, this.options(), http)
  };
  models.Doc.prototype.getIncoming = function () {
    return getIncoming(this.title, this.options(), http)
  };
  models.Doc.prototype.getPageViews = function () {
    return getPageViews(this, this.options(), http)
  };
  models.Doc.prototype.mainImage = mainImage;
  models.Doc.prototype.getHtml = function () {
    return getParse(this.title, this.options(), http, 'text')
  };
  models.Doc.prototype.getWikiscript = function () {
    return getParse(this.title, this.options(), http, 'wikitext')
  };
  models.Doc.prototype.getExtract = function (options) {
    return getExtract(this.title, { ...this.options(), ...options }, http)
  };

  // image methods
  models.Image.prototype.commonsURL = function () {
    return commonsURL(this.file())
  };
  models.Image.prototype.exists = function (options) {
    return imageExists(this.url(), options)
  };
  models.Image.prototype.license = function (options) {
    return imageLicense(this.file(), options, http)
  };

  // constructor methods
  models.wtf.getRandomPage = function (options) {
    return getRandom(options, http, models.wtf)
  };
  models.wtf.getRandomCategory = function (options) {
    return randomCategory(options, http)
  };
  models.wtf.getTemplatePages = function (template, options) {
    return getTransclusions(template, options, http)
  };
  models.wtf.getCategoryPages = function (category, options) {
    return getCategory(category, options, http)
  };
  models.wtf.fetchList = function (list, options) {
    return fetchList(list, options, models.wtf)
  };
  models.wtf.getIncoming = function (title, options) {
    return getIncoming(title, options, http)
  };
  models.wtf.getRedirects = function (title, options) {
    return getRedirects(title, options, http)
  };
  models.wtf.getHtml = function (title, options) {
    return getParse(title, options, http, 'text')
  };
  models.wtf.getWikiscript = function (title, options) {
    return getParse(title, options, http, 'wikitext')
  };
  models.wtf.getExtract = function (title, options) {
    return getExtract(title, options, http)
  };
  // aliases
  models.wtf.random = models.wtf.getRandomPage;
};
addMethod.version = version;

export { addMethod as default };
