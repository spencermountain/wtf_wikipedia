const i18n = require('../data/i18n');
const make_image = require('../lib/make_image');

//parsing functions
const redirects = require('./page/redirects');
const disambig = require('./page/disambig');

const word_templates = require('./cleanup/word_templates');
const preprocess = require('./cleanup/misc');

const parse_tables = require('./table');
const parse_categories = require('./categories');
const parse_recursion = require('./recursive');
const parse_text = require('./text');

//regexs
const img_regex = new RegExp('^(' + i18n.images.concat(i18n.files).join('|') + ')', 'i');

//some xml elements are just junk, and demand full inglorious death by regular exp
//other xml elements, like <em>, are plucked out afterwards
const main = function(wiki) {
  wiki = wiki || '';
  //detect if page is just redirect, and return
  if (redirects.is_redirect(wiki)) {
    return redirects.parse_redirect(wiki);
  }
  //detect if page is just disambiguator page, and return
  if (disambig.is_disambig(wiki)) {
    return disambig.parse_disambig(wiki);
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
  //parse+remove scary '[[ [[]] ]]' stuff
  wiki = parse_recursion(r, wiki);
  //ok, now that the scary recursion issues are gone, we can trust simple regex methods..
  //kill the rest of templates
  wiki = wiki.replace(/\{\{.*?\}\}/g, '');
  //get list of links, categories
  wiki = parse_categories(r, wiki);
  //parse all the headings, and their texts
  wiki = parse_text(r, wiki);
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
