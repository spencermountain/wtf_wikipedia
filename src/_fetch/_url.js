const site_map = require('../_data/site_map');
const isUrl = /^https?:\/\//;

function isArray(arr) {
  return arr.constructor.toString().indexOf('Array') > -1;
}

//construct a lookup-url for the wikipedia api
const makeUrl = function(title, lang, options) {
  lang = lang || 'en';
  //if given a url...
  if (isUrl.test(title) === true) {
    title = title.replace(/.*?\/wiki\//, '');
    title = title.replace(/\?.*/, '');
  }
  let url = `https://${lang}.wikipedia.org/w/api.php`;
  if (site_map[lang]) {
    url = site_map[lang] + '/w/api.php';
  }
  if (options.wikiUrl) {
    url = options.wikiUrl;
  }
  //we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..
  url += '?action=query&prop=revisions&rvprop=content&maxlag=5&rvslots=main&format=json';
  if (!options.wikiUrl) {
    url += '&origin=*';
  }
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

module.exports = makeUrl;
