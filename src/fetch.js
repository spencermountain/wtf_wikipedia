//grab the content of any article, off the api
const fetch = require('node-fetch');
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
  url += '?action=query&prop=revisions&rvlimit=1&rvprop=content&format=json&origin=*';
  url += '&' + lookup + '=' + encodeURIComponent(title);
  return url;
};

//this data-format from mediawiki api is nutso
const postProcess = function(data) {
  let pages = Object.keys(data.query.pages)[0];
  let page = data.query.pages[pages] || {};
  let text = page.revisions[0]['*'];
  let options = {
    title: page.title,
    pageID: page.pageid,
  };
  return new Document(text, options);
};

const throwErr = (r, cb) => {
  if (cb && typeof cb === 'function') {
    return cb(response, {});
  }
  return {};
};

const getData = function(url) {
  return fetch(url).then((response) => {
    if (response.status !== 200) {
      throwErr(response, callback);
    }
    return response.json();
  });
};

const getPage = function(title, lang, callback) {
  let url = makeUrl(title, lang);
  return new Promise(function(resolve, reject) {
    let p = getData(url);
    p.then(postProcess).then((doc) => {
      //support 'err-back' format
      if (callback && typeof callback === 'function') {
        callback(null, doc);
      }
      resolve(doc);
    });
    p.catch(reject);
  });
};


module.exports = getPage;
