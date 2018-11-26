const fetch = require('cross-fetch');
const site_map = require('./_data/site_map');


const makeUrl = function(cat, lang, options) {
  cat = encodeURIComponent(cat);
  let url = `https://${lang}.wikipedia.org/w/api.php`;
  if (site_map[lang]) {
    url = site_map[lang] + '/w/api.php';
  }
  url += `?action=query&list=categorymembers&cmtitle=${cat}&cmlimit=500&format=json&origin=*&redirects=true&cmtype=page|subcat`;
  return url;
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

const getCategory = function(lang, options, cb) {
  lang = lang || 'en';
  if (typeof lang === 'function') {
    cb = lang;
    lang = 'en';
  }
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  options = options || {};
};

let cat = 'Category:Templates';
