//grab the content of any article, off the api
var request = require('request');
var site_map = require('../data/site_map');
var redirects = require('../parse/parse_redirects');

var fetch = function(page_identifier, lang_or_wikiid, cb) {
  lang_or_wikiid = lang_or_wikiid || 'en';
  var identifier_type = 'title';
  if (page_identifier.match(/^[0-9]*$/) && page_identifier.length > 3) {
    identifier_type = 'curid';
  }
  var url;
  if (site_map[lang_or_wikiid]) {
    url = site_map[lang_or_wikiid] + '/w/index.php?action=raw&' + identifier_type + '=' + page_identifier;
  } else {
    url = 'http://' + lang_or_wikiid + '.wikipedia.org/w/index.php?action=raw&' + identifier_type + '=' + page_identifier;
  }
  request({
    uri: url
  }, function(error, response, body) {
    if (error) {
      console.warn(error);
      cb(null);
    } else if (redirects.is_redirect(body)) {
      var result = redirects.parse_redirect(body);
      fetch(result.redirect, lang_or_wikiid, cb);
    } else {
      cb(body);
    }
  });
};

module.exports = fetch;

// fetch("On A Friday", 'en', function(r) { // 'afwiki'
//   console.log(JSON.stringify(r, null, 2));
// })
