//grab the content of any article, off the api
const site_map = require('../_data/site_map');
const request = require('./_request');
const getParams = require('./_params');
const parseDoc = require('../01-document');
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
  if (options.wikiUrl) {
    url = options.wikiUrl;
  }
  //we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..
  url += '?action=query&prop=revisions&rvprop=content&maxlag=5&format=json';
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

//this data-format from mediawiki api is nutso
const postProcess = function(data, options) {
  let pages = Object.keys(data.query.pages);
  let docs = pages.map(id => {
    let page = data.query.pages[id] || {};
    if (page.hasOwnProperty('missing') || page.hasOwnProperty('invalid')) {
      return null;
    }
    let text = page.revisions[0]['*'];
    //us the 'generator' result format, for the random() method
    if (!text && page.revisions[0].slots) {
      text = page.revisions[0].slots.main['*'];
    }
    options.title = page.title;
    options.pageID = page.pageid;
    try {
      return parseDoc(text, options);
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


const getPage = function(title, a, b, c) {
  let {lang, options, callback} = getParams(a, b, c);
  let url = makeUrl(title, lang, options);
  return new Promise(function(resolve, reject) {
    let p = request(url, options);
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
