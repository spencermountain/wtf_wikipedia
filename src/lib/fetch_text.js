'use strict';
//grab the content of any article, off the api
const request = require('superagent');
const site_map = require('../data/site_map');
const redirects = require('../parse/page/redirects');

const fetch = function(page_identifier, lang_or_wikiid, cb) {
  lang_or_wikiid = lang_or_wikiid || 'en';
  var identifier_type = 'titles';
  if (page_identifier.match(/^[0-9]*$/) && page_identifier.length > 3) {
    identifier_type = 'curid';
  }
  let url;
  if (site_map[lang_or_wikiid]) {
    url = site_map[lang_or_wikiid] + '/w/api.php';
  } else {
    url = 'https://' + lang_or_wikiid + '.wikipedia.org/w/api.php';
  }
  //we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..
  url += '?action=query&prop=revisions&rvlimit=1&rvprop=content&format=json&origin=*';
  url += '&' + identifier_type + '=' + encodeURIComponent(page_identifier);

  request.get(url).end(function(err, res) {
    if (err || !res.body.query) {
      console.warn(err);
      cb(null);
      return;
    }
    var pages = res.body.query.pages || {};
    var id = Object.keys(pages)[0];
    if (id) {
      var page = pages[id];
      if (page && page.revisions && page.revisions[0]) {
        var text = page.revisions[0]['*'];
        if (redirects.is_redirect(text)) {
          var result = redirects.parse_redirect(text);
          fetch(result.redirect, lang_or_wikiid, cb); //recursive
          return;
        }
        cb(text);
      } else {
        cb(null);
      }
    }
  });
};

module.exports = fetch;

// fetch('On_A_Friday', 'en', function(r) { // 'afwiki'
//   console.log(JSON.stringify(r, null, 2));
// });
