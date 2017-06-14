const i18n = require('../data/i18n');
const languages = require('../data/languages');
const sentence_parser = require('../lib/sentence_parser');
const make_image = require('../lib/make_image');
const helpers = require('../lib/helpers');

//parsing functions
const redirects = require('./redirects');
const parse_table = require('./table');
const parse_categories = require('./categories');
const parse_disambig = require('./disambig');
const parse_infobox = require('./infobox');
const parse_infobox_template = require('./infobox_template');
const parse_image = require('./image');
const parse_line = require('./text/line');
const word_templates = require('./cleanup/word_templates');
const recursive_matches = require('./cleanup/recursive_matches');
const preprocess = require('./cleanup/misc');

//regexs
const template_reg = new RegExp('\\{\\{ ?(' + i18n.disambigs.join('|') + ')(\\|[a-z =]*?)? ?\\}\\}', 'i');
const infobox_reg = new RegExp('{{(' + i18n.infoboxes.join('|') + ')[: \n]', 'ig');
const ban_headings = new RegExp('^ ?(' + i18n.sources.join('|') + ') ?$', 'i'); //remove things like 'external links'
const fileRegex = new RegExp('\\[\\[(' + i18n.images.concat(i18n.files).join('|') + ')', 'i');
const img_regex = new RegExp('^(' + i18n.images.concat(i18n.files).join('|') + ')', 'i');
const table_reg = /\{\|[\s\S]{1,8000}?\|\}/g;
const noWrap_reg = /^\{\{nowrap\|(.*?)\}\}$/;

// options
const defaultParseOptions = {
  ignoreLists: true
};

//some xml elements are just junk, and demand full inglorious death by regular exp
//other xml elements, like <em>, are plucked out afterwards
const main = function(wiki, options) {
  wiki = wiki || '';
  options = Object.assign({}, defaultParseOptions, options);
  //detect if page is just redirect, and return
  if (redirects.is_redirect(wiki)) {
    return redirects.parse_redirect(wiki);
  }
  //detect if page is disambiguator page
  if (wiki.match(template_reg)) {
    //|| wiki.match(/^.{3,25} may refer to/i)|| wiki.match(/^.{3,25} ist der Name mehrerer /i)
    return parse_disambig(wiki);
  }

  let r = {
    type: 'page',
    text: {},
    categories: [],
    images: [],
    infobox: {},
    infobox_template: {},
    tables: [],
    translations: {}
  };
  //parse templates like {{currentday}}
  wiki = word_templates(wiki);
  //kill off th3 craziness
  wiki = preprocess(wiki);
  //find tables
  r.tables = wiki.match(table_reg, '') || [];
  r.tables = r.tables.map(function(s) {
    return parse_table(s);
  });
  //remove tables
  wiki = wiki.replace(/\{\|[\s\S]{1,8000}?\|\}/g, '');

  //reduce the scary recursive situations
  //remove {{template {{}} }} recursions
  let matches = recursive_matches('{', '}', wiki);
  matches.forEach(function(s) {
    if (s.match(infobox_reg, 'ig') && Object.keys(r.infobox).length === 0) {
      r.infobox = parse_infobox(s);
      r.infobox_template = parse_infobox_template(s);
    }
    if (s.match(infobox_reg)) {
      wiki = wiki.replace(s, '');
    }
    //rest of them...
    if (s.match(/^\{\{/)) {
      //support nowrap
      const nowrap = s.match(noWrap_reg);
      if (nowrap) {
        wiki = wiki.replace(s, nowrap[1]);
        return;
      }
      //if it's not a known template, but it's recursive, remove it
      //(because it will be misread later-on)
      wiki = wiki.replace(s, '');
    }
  });

  //second, remove [[file:...[[]] ]] recursions
  matches = recursive_matches('[', ']', wiki);
  matches.forEach(function(s) {
    if (s.match(fileRegex)) {
      r.images.push(parse_image(s));
      wiki = wiki.replace(s, '');
    }
  });
  //third, wiktionary-style interlanguage links
  matches.forEach(function(s) {
    if (s.match(/\[\[([a-z][a-z]):(.*?)\]\]/i) !== null) {
      const lang = s.match(/\[\[([a-z][a-z]):/i)[1];
      if (lang && languages[lang]) {
        r.translations[lang] = s.match(/\[\[([a-z][a-z]):(.*?)\]\]/i)[2];
      }
      wiki = wiki.replace(s, '');
    }
  });

  //now that the scary recursion issues are gone, we can trust simple regex methods

  //kill the rest of templates
  wiki = wiki.replace(/\{\{.*?\}\}/g, '');

  //get list of links, categories
  r.categories = parse_categories(wiki);
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

    if (options.ignoreLists) {
      //ignore list
      if (part.match(/^[#\*:;\|]/)) {
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
  //add additional image from infobox, if applicable
  if (r.infobox['image'] && r.infobox['image'].text) {
    let img = r.infobox['image'].text || '';
    if (typeof img === 'string' && !img.match(img_regex)) {
      img = 'File:' + img;
    }
    r.images.push(img);
  }
  //add url, etc to image
  r.images = r.images.map(make_image);
  return r;
};

module.exports = main;
