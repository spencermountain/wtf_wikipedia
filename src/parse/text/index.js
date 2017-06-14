const i18n = require('../../data/i18n');
const sentence_parser = require('../../lib/sentence_parser');
const helpers = require('../../lib/helpers');
const parse_line = require('./line');
const ban_headings = new RegExp('^ ?(' + i18n.sources.join('|') + ') ?$', 'i'); //remove things like 'external links'
const list_reg = /^[#\*:;\|]+/;

const parseText = function(r, wiki) {
  //next, map each line into a parsable sentence
  let lines = wiki.replace(/\r/g, '').split(/\n/);
  let section = 'Intro';
  let number = 1;

  lines.forEach(function(part) {
    if (!section) {
      return;
    }
    //add # numberings formatting
    if (part.match(/^ ?\#[^:,\|]{4}/i)) {
      part = part.replace(/^ ?#*/, number + ') ');
      part = part + '\n';
      number += 1;
    } else {
      number = 1;
    }
    //add bullet-points formatting
    if (part.match(/^\*+[^:,\|]{4}/)) {
      part = part + '\n';
    }
    //remove some nonsense wp lines

    //parse lists
    if (part.match(list_reg)) {
      part = part.replace(list_reg, '');
      if (part.length < 10) {
        //not a full sentence
        return;
      }
    }

    //ignore only-punctuation
    if (!part.match(/[a-z0-9]/i)) {
      return;
    }
    //headings
    if (part.match(/^={1,5}[^=]{1,200}={1,5}$/)) {
      section = part.match(/^={1,5}([^=]{1,200}?)={1,5}$/) || [];
      section = section[1] || '';
      section = section.replace(/\./g, ' '); // this is necessary for mongo, i'm sorry
      section = helpers.trim_whitespace(section);
      //ban some sections
      if (section && section.match(ban_headings)) {
        section = undefined;
      }
      return;
    }

    //still alive, add it to the section
    sentence_parser(part).forEach(function(line) {
      line = parse_line(line);

      if (line && line.text) {
        if (!r.text[section]) {
          r.text[section] = [];
        }
        r.text[section].push(line);
      }
    });
  });
  return wiki;
};

module.exports = parseText;
