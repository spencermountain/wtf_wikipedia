//turns wikimedia script into json
// https://github.com/spencermountain/wtf_wikipedia
//@spencermountain
const fetch = require('./lib/fetch_text');
const parse = require('./parse');

//from a page title or id, fetch the wikiscript
const from_api = function(page_identifier, lang_or_wikiid, cb) {
  if (typeof lang_or_wikiid === 'function') {
    cb = lang_or_wikiid;
    lang_or_wikiid = 'en';
  }
  cb = cb || function() {};
  lang_or_wikiid = lang_or_wikiid || 'en';
  if (!fetch) {
    //no http method, on the client side
    return cb(null);
  }
  return fetch(page_identifier, lang_or_wikiid, cb);
};

//turn wiki-markup into a nicely-formatted text
const plaintext = function(str) {
  let data = parse(str) || {};
  let arr = Object.keys(data.sections).map(k => {
    return data.sections[k].sentences.map(a => a.text).join(' ');
  });
  return arr.join('\n\n');
};

module.exports = {
  from_api: from_api,
  parse: parse,
  plaintext: plaintext
};
