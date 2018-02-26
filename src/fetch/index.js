//grab the content of any article, off the api
const site_map = require('../data/site_map');
const fetch = require('node-fetch');
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

//
const getPage = function(title, lang, callback) {
  let url = makeUrl(title, lang);
  let p = fetch(url);

  const throwErr = (r, cb) => {
    if (cb && typeof cb === 'function') {
      return cb(response, {});
    }
    return {};
  };

  p.then((response) => {
    if (response.status !== 200) {
      return throwErr(response, callback);
    }
    return response.json().then(function(data) {
      let pages = Object.keys(data.query.pages)[0]; //this is nuts
      let page = data.query.pages[pages] || {};
      let obj = {
        title: page.title,
        pid: page.pageid,
        text: page.revisions[0]['*']
      };
      //support a callback-style, if it's there
      if (callback && typeof callback === 'function') {
        return callback(null, obj);
      }
      return obj;
    });
  });
  p.catch(function(err) {
    return throwErr(err, callback);
  });
  return p;
};
module.exports = getPage;
