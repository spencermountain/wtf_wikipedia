const i18n = require('../../data/i18n');
const find_recursive = require('../../../lib/recursive_match');

const parseImages = function(r, wiki) {
  //second, remove [[file:...[[]] ]] recursions
  matches = find_recursive('[', ']', wiki);
  matches.forEach(function(s) {
    if (s.match(fileRegex)) {
      r.images.push(parse_image(s));
      wiki = wiki.replace(s, '');
    }
  });

  //third, wiktionary-style interlanguage links
  matches.forEach(function(s) {
    if (s.match(/\[\[([a-z]+):(.*?)\]\]/i) !== null) {
      let site = s.match(/\[\[([a-z]+):/i)[1];
      site = site.toLowerCase();
      if (site && i18n.dictionary[site] === undefined) {
        r.interwiki[site] = s.match(/\[\[([a-z]+):(.*?)\]\]/i)[2];
        wiki = wiki.replace(s, '');
      }
    }
  });
  return wiki;
};
module.exports = parseImages;
