const sentence_parser = require('./lib/sentence_parser');
const fetch = require('./lib/fetch_text');
const make_image = require('./lib/make_image');
const i18n = require('./data/i18n');
const helpers = require('./lib/helpers');
const languages = require('./data/languages');
//parsers
const redirects = require('./parse/parse_redirects');
const parse_table = require('./parse/parse_table');
const parse_line = require('./parse/parse_line');
const parse_categories = require('./parse/parse_categories');
const parse_disambig = require('./parse/parse_disambig');
const parse_infobox = require('./parse/parse_infobox');
const parse_infobox_template = require('./parse/parse_infobox_template');
const parse_image = require('./parse/parse_image');
const recursive_matches = require('./recursive_matches');
const preprocess = require('./parse/cleanup_misc');
const word_templates = require('./word_templates');

//regexs
const template_reg = new RegExp('\\{\\{ ?(' + i18n.disambigs.join('|') + ')(\\|[a-z =]*?)? ?\\}\\}', 'i');
const infobox_reg = new RegExp('{{(' + i18n.infoboxes.join('|') + ')[: \n]', 'ig');
const ban_headings = new RegExp('^ ?(' + i18n.sources.join('|') + ') ?$', 'i'); //remove things like 'external links'

// options
const defaultParseOptions = {
  ignoreLists: true
};

//some xml elements are just junk, and demand full inglorious death by regular exp
//other xml elements, like <em>, are plucked out afterwards
const main = function(wiki, options) {
  options = Object.assign({}, defaultParseOptions, options);
  let infobox = {};
  let infobox_template = '';
  let images = [];
  let tables;
  let translations = {};
  wiki = wiki || '';
  //detect if page is just redirect, and return
  if (redirects.is_redirect(wiki)) {
    return redirects.parse_redirect(wiki);
  }
  //detect if page is disambiguator page
  if (wiki.match(template_reg)) {
    //|| wiki.match(/^.{3,25} may refer to/i)|| wiki.match(/^.{3,25} ist der Name mehrerer /i)
    return parse_disambig(wiki);
  }
  //parse templates like {{currentday}}
  wiki = word_templates(wiki);
  //kill off th3 craziness
  wiki = preprocess(wiki);
  //find tables
  tables = wiki.match(/\{\|[\s\S]{1,8000}?\|\}/g, '') || [];
  tables = tables.map(function(s) {
    return parse_table(s);
  });
  //remove tables
  wiki = wiki.replace(/\{\|[\s\S]{1,8000}?\|\}/g, '');

  //reduce the scary recursive situations
  //remove {{template {{}} }} recursions
  let matches = recursive_matches('{', '}', wiki);
  matches.forEach(function(s) {
    if (s.match(infobox_reg, 'ig') && Object.keys(infobox).length === 0) {
      infobox = parse_infobox(s);
      infobox_template = parse_infobox_template(s);
    }
    if (s.match(infobox_reg)) {
      wiki = wiki.replace(s, '');
    }
    //rest of them...
    if (s.match(/^\{\{/)) {
      //support nowrap
      const nowrap = s.match(/^\{\{nowrap\|(.*?)\}\}$/);
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
    if (s.match(new RegExp('\\[\\[(' + i18n.images.concat(i18n.files).join('|') + ')', 'i'))) {
      images.push(parse_image(s));
      wiki = wiki.replace(s, '');
    }
  });
  //third, wiktionary-style interlanguage links
  matches.forEach(function(s) {
    if (s.match(/\[\[([a-z][a-z]):(.*?)\]\]/i) !== null) {
      const lang = s.match(/\[\[([a-z][a-z]):/i)[1];
      if (lang && languages[lang]) {
        translations[lang] = s.match(/\[\[([a-z][a-z]):(.*?)\]\]/i)[2];
      }
      wiki = wiki.replace(s, '');
    }
  });

  //now that the scary recursion issues are gone, we can trust simple regex methods

  //kill the rest of templates
  wiki = wiki.replace(/\{\{.*?\}\}/g, '');

  //get list of links, categories
  const cats = parse_categories(wiki);
  //next, map each line into a parsable sentence
  // const output = {};
  let output = {};
  const lines = wiki.replace(/\r/g, '').split(/\n/);
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

    const sectionLabel = section;

    //still alive, add it to the section
    sentence_parser(part).forEach(function(line) {
      line = parse_line(line);

      if (line && line.text) {
        // if (!output[section]) {
        if (!output[sectionLabel]) {
          // output[section] = [];
          output[sectionLabel] = [];
        }
        // output[section].push(line);
        output[sectionLabel].push(line);
      }
    });
  });
  //add additional image from infobox, if applicable
  if (infobox['image'] && infobox['image'].text) {
    let img = infobox['image'].text || '';
    if (typeof img === 'string' && !img.match(new RegExp('^(' + i18n.images.concat(i18n.files).join('|') + ')', 'i'))) {
      img = 'File:' + img;
    }
    images.push(img);
  }
  //add url, etc to image
  images = images.map(make_image);
  return {
    type: 'page',
    text: output,
    categories: cats,
    images: images,
    infobox: infobox,
    infobox_template: infobox_template,
    tables: tables,
    translations: translations
  };
};

module.exports = main;
