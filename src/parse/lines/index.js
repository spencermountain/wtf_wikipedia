// const i18n = require('../../data/i18n');
// const sentence_parser = require('../../lib/sentence_parser');
// const helpers = require('../../lib/helpers');
// const parse_line = require('./line');
// const ban_headings = new RegExp('^ ?(' + i18n.sources.join('|') + ') ?$', 'i'); //remove things like 'external links'
const parseSections = require('./sections');
// const parseLists = require('./lists');

const parseText = function(r, wiki) {
  //next, map each line into a parsable sentence
  let lines = wiki.replace(/\r/g, '').split(/\n/);

  r.sections = parseSections(lines);

  return wiki;
};

module.exports = parseText;
