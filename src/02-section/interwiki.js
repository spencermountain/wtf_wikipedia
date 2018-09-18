const i18n = require('../data/i18n');
//
const interwiki = function(matches, r, wiki, options) {
  //third, wiktionary-style interlanguage links
  matches.forEach(function(s) {
    if (s.match(/\[\[([a-z]+):(.*?)\]\]/i) !== null) {
      let site = (s.match(/\[\[([a-z]+):/i) || [])[1] || '';
      site = site.toLowerCase();
      if (site && i18n.dictionary[site] === undefined && !(options.namespace !== undefined && options.namespace === site)) {
        r.interwiki = r.interwiki || {};
        r.interwiki[site] = (s.match(/\[\[([a-z]+):(.*?)\]\]/i) || [])[2];
        wiki = wiki.replace(s, '');
      }
    }
  });
  return wiki;
};
module.exports = interwiki;
