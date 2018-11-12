//grab the content of any article, off the api
const fetch = require('cross-fetch');
const site_map = require('./_data/site_map');
const parseDocument = require('./01-document');
// const redirects = require('../parse/page/redirects');

function isArray(arr) {
  return arr.constructor.toString().indexOf('Array') > -1;
}

//construct a lookup-url for the wikipedia api
const makeUrl = function(title, lang, options) {
  lang = lang || 'en';
  let url = `https://${lang}.wikipedia.org/w/api.php`;
  if (site_map[lang]) {
    url = site_map[lang] + '/w/api.php';
  }
  //we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..
  url += '?action=query&prop=revisions&rvprop=content&maxlag=5&format=json&origin=*';
  if (options.follow_redirects !== false) {
    url += '&redirects=true';
  }
  var lookup = 'titles';
  let pages = [];
  //support one, or many pages
  if (isArray(title) === false) {
    pages = [title];
  } else {
    pages = title;
  }
  //assume numbers mean pageid, and strings are titles (like '1984')
  if (typeof pages[0] === 'number') {
    lookup = 'pageids';
  } else {
    pages = pages.map((str) => {
      if (typeof str === 'string') {
        return encodeURIComponent(str);
      }
      return str;
    });
  }
  pages = pages.join('|');
  url += '&' + lookup + '=' + pages;
  return url;
};

//this data-format from mediawiki api is nutso
const postProcess = function(data, options) {
  let pages = Object.keys(data.query.pages);
  let docs = pages.map(id => {
    let page = data.query.pages[id] || {};
    if (page.hasOwnProperty('missing') || page.hasOwnProperty('invalid')) {
      return null;
    }
    let text = page.revisions[0]['*'];
    options.title = page.title;
    options.pageID = page.pageid;
    try {
      return parseDocument(text, options);
    } catch (e) {
      console.error(e);
      throw e
    }
  });
  //return an array if there was more than one page given
  if (docs.length > 1) {
    return docs;
  }
  //just return the first one
  return docs[0];
};


const getData = function(url, options) {
  let params = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Api-User-Agent': options.userAgent || options['User-Agent'] || options['Api-User-Agent'] || 'Random user of the wtf_wikipedia library'
    },
  };
  return fetch(url, params).then((response) => {
    if (response.status !== 200) {
      throw response;
    }
    return response.json();
  }).catch(console.error);
};

const getPage = function(title, a, b, c) {
  //allow quite! flexible params
  let options = {};
  let lang = 'en';
  let callback = null;
  if (typeof a === 'function') {
    callback = a;
  } else if (typeof a === 'object') {
    options = a;
  } else if (typeof a === 'string') {
    lang = a;
  }
  if (typeof b === 'function') {
    callback = b;
  } else if (typeof b === 'object') {
    options = b;
  }
  if (typeof c === 'function') {
    callback = c;
  }
  let url = makeUrl(title, lang, options);
  return new Promise(function(resolve, reject) {
    let p = getData(url, options);

    p.then((wiki) => {
      return postProcess(wiki, options);
    }).then((doc) => {
      //support 'err-back' format
      if (callback && typeof callback === 'function') {
        callback(null, doc);
      }
      resolve(doc);
    }).catch(reject);
  });
};


module.exports = getPage;
