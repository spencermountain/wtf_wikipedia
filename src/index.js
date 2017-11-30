//turns wikimedia script into json
// https://github.com/spencermountain/wtf_wikipedia
//@spencermountain
const fetch = require('./lib/fetch_text');
const parse = require('./parse');
const version = require('../package').version;

//use a global var for lazy customization
let options = {};

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
  let data = parse(str, options) || {};
  data.sections = data.sections || [];
  let arr = data.sections.map(d => {
    return d.sentences.map(a => a.text).join(' ');
  });
  return arr.join('\n\n');
};

const customize = function(obj) {
  options.custom = obj;
};

module.exports = {
  from_api: from_api,
  plaintext: plaintext,
  version: version,
  custom: customize,
  parse: (str, obj) => {
    obj = obj || {};
    obj = Object.assign(obj, options); //grab 'custom' persistent options
    return parse(str, obj);
  }
};
