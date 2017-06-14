// const i18n = require('../../data/i18n');
// const sentence_parser = require('../../lib/sentence_parser');
// const helpers = require('../../lib/helpers');
// const parse_line = require('./line');
// const ban_headings = new RegExp('^ ?(' + i18n.sources.join('|') + ') ?$', 'i'); //remove things like 'external links'
const sections = require('./sections');

const parseText = function(r, wiki) {
  //next, map each line into a parsable sentence
  let lines = wiki.replace(/\r/g, '').split(/\n/);

  r.sections = sections(lines);

  // lines.forEach(function(part) {
  //   if (!section) {
  //     return;
  //   }
  //   //ignore lines with only-punctuation
  //   if (!part.match(/[a-z0-9]/i)) {
  //     return;
  //   }
  //   //headings
  //   if (part.match(heading_reg)) {
  //     section = part.match(/^={1,5}([^=]{1,200}?)={1,5}$/) || [];
  //     section = section[1] || '';
  //     section = section.replace(/\./g, ' '); // this is necessary for mongo, i'm sorry
  //     section = helpers.trim_whitespace(section);
  //     //ban some sections
  //     if (section && section.match(ban_headings)) {
  //       section = undefined;
  //     }
  //     return;
  //   }

  //   //still alive, add it to the section
  //   let sentences = sentence_parser(part);
  //   sentences.forEach(function(line) {
  //     line = parse_line(line);

  //     if (line && line.text) {
  //       if (!r.text[section]) {
  //         r.text[section] = [];
  //       }
  //       r.text[section].push(line);
  //     }
  //   });
  // });
  return wiki;
};

module.exports = parseText;
