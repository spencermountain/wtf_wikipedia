//grab the content of any article, off the api
var request = require('superagent');
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

  request
    .get(url)
    .end(function(err, res) {
      if (err) {
        console.warn(err);
        cb(null);
      } else if (redirects.is_redirect(res.text)) {
        var result = redirects.parse_redirect(res.text);
        fetch(result.redirect, lang_or_wikiid, cb);
      } else {
        cb(res.text);
      }
    });
};

module.exports = fetch;

// fetch("On A Friday", 'en', function(r) { // 'afwiki'
//   console.log(JSON.stringify(r, null, 2));
// })
