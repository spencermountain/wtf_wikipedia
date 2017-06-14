//turns wikimedia script into json
// https://github.com/spencermountain/wtf_wikipedia
//@spencermountain
const main = require('./main');

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

const plaintext = function(str) {
  var data = main(str) || {};
  data.text = data.text || [];
  var text = '';
  Object.keys(data.text).forEach(function(k) {
    text += data.text[k].map(a => a.text).join(' ') + '\n';
  });
  return text;
};

module.exports = {
  from_api: from_api,
  parse: main,
  plaintext: plaintext
};
