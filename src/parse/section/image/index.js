const i18n = require('../../../data/i18n');
const languages = require('../../../data/languages');
const find_recursive = require('../../../lib/recursive_match');
const parse_image = require('./image');
const fileRegex = new RegExp('(' + i18n.images.concat(i18n.files).join('|') + '):.*?[\\|\\]]', 'i');

const parseImages = function(r, wiki) {
  //second, remove [[file:...[[]] ]] recursions
  let matches = find_recursive('[', ']', wiki);
  matches.forEach(function(s) {
    if (s.match(fileRegex)) {
      r.images = r.images || [];
      r.images.push(parse_image(s));
      wiki = wiki.replace(s, '');
    }
  });

  var namespaceList = r.page_identifier != undefined ? r.page_identifier.match(/^(.*?):.*$/) : [];
  var namespace = namespaceList.length > 1 ? namespaceList[1].toLowerCase() : "";

  //third, wiktionary-style interlanguage links
  matches.forEach(function(s) {
    if (s.match(/\[\[([a-z]+):(.*?)\]\]/i) !== null) {
      let site = (s.match(/\[\[([a-z]+):/i) || [])[1] || '';
      site = site.toLowerCase();
      if (site && i18n.dictionary[site] === undefined && site !== namespace) {
        r.interwiki = r.interwiki || {};
        r.interwiki[site] = (s.match(/\[\[([a-z]+):(.*?)\]\]/i) || [])[2];
        wiki = wiki.replace(s, '');
      }
    }
  });
  return wiki;
};
module.exports = parseImages;
