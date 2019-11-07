//grab the content of any article, off the api
const fetch = require('cross-fetch');
const site_map = require('./data/site_map');
const Document = require('./document/Document');
// const redirects = require('../parse/page/redirects');
const isNumber = /^[0-9]*$/;

//construct a lookup-url for the wikipedia api
const makeUrl = function(title, lang) {
  lang = lang || 'en';

  var lookup = 'titles';
  if (isNumber.test(title) && title.length > 3) {
    lookup = 'curid';
  }
  let url = 'https://' + lang + '.wikipedia.org/w/api.php';
  if (site_map[lang]) {
    url = site_map[lang] + '/w/api.php';
  }
  //we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..
  url += '?action=query&redirects=true&prop=revisions&rvprop=content&maxlag=5&format=json&origin=*';
  //support multiple titles
  if (typeof title === 'string') {
    title = [title];
  }
  title = title.map(encodeURIComponent);
  title = title.join('|');
  url += '&' + lookup + '=' + title;
  return url;
};

//this data-format from mediawiki api is nutso
const postProcess = function(data) {
  let pages = Object.keys(data.query.pages);
  let docs = pages.map(id => {
    let page = data.query.pages[id] || {};
    let text = page.revisions[0]['*'];
    let options = {
      title: page.title,
      pageID: page.pageid,
    };
    return new Document(text, options);
  });
  //return an array if there was more than one page given
  if (docs.length > 1) {
    return docs;
  }
  //just return the first one
  return docs[0];
};

const throwErr = (r, cb) => {
  if (cb && typeof cb === 'function') {
    return cb(response, {});
  }
  return {};
};

const getData = function(url, options) {
  // Api-User-Agent
  let params = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Api-User-Agent': options.userAgent || options['User-Agent'] || options['Api-User-Agent'] || 'Random user of the wtf_wikipedia library'
    },
  };
  return fetch(url, params).then((response) => {
    if (response.status !== 200) {
      throwErr(response, callback);
    }
    return response.json();
  });
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
  let url = makeUrl(title, lang);
  let promise = new Promise(function(resolve, reject) {
    let p = getData(url, options);
    p.then(postProcess).then((doc) => {
      //support 'err-back' format
      if (callback && typeof callback === 'function') {
        callback(null, doc);
      }
      resolve(doc);
    });
    p.catch(reject);
  });
  return promise;
};


module.exports = getPage;
