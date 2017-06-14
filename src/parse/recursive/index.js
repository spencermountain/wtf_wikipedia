const i18n = require('../../data/i18n');
const languages = require('../../data/languages');
const find_recursive = require('./find');

const parse_infobox = require('./infobox');
const parse_infobox_template = require('./infobox_template');
const parse_image = require('./image');

const infobox_reg = new RegExp('{{(' + i18n.infoboxes.join('|') + ')[: \n]', 'ig');
const fileRegex = new RegExp('\\[\\[(' + i18n.images.concat(i18n.files).join('|') + ')', 'i');
const img_regex = new RegExp('^(' + i18n.images.concat(i18n.files).join('|') + ')', 'i');
const noWrap_reg = /^\{\{nowrap\|(.*?)\}\}$/;

//reduce the scary recursive situations
const parse_recursive = function(r, wiki) {
  //remove {{template {{}} }} recursions
  let matches = find_recursive('{', '}', wiki);
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
  matches = find_recursive('[', ']', wiki);
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

  //add additional image from infobox, if applicable
  if (r.infobox['image'] && r.infobox['image'].text) {
    let img = r.infobox['image'].text || '';
    if (typeof img === 'string' && !img.match(img_regex)) {
      img = 'File:' + img;
    }
    r.images.push(img);
  }

  return wiki;
};

module.exports = parse_recursive;
