const i18n = require('../data/i18n');
const sentence_parser = require('../lib/sentence_parser');
const make_image = require('../lib/make_image');
const helpers = require('../lib/helpers');

//parsing functions
const parse_tables = require('./table');
const parse_categories = require('./categories');
const parse_recursion = require('./recursion');

const redirects = require('./page/redirects');
const parse_disambig = require('./page/disambig');
const parse_line = require('./text/line');
const word_templates = require('./cleanup/word_templates');
const preprocess = require('./cleanup/misc');

//regexs
const template_reg = new RegExp('\\{\\{ ?(' + i18n.disambigs.join('|') + ')(\\|[a-z =]*?)? ?\\}\\}', 'i');
const ban_headings = new RegExp('^ ?(' + i18n.sources.join('|') + ') ?$', 'i'); //remove things like 'external links'
const img_regex = new RegExp('^(' + i18n.images.concat(i18n.files).join('|') + ')', 'i');

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
  //kill off (some) craziness
  wiki = preprocess(wiki);
  //parse the tables
  wiki = parse_tables(r, wiki);

  wiki = parse_recursion(r, wiki);
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
