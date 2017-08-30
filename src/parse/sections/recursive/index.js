const i18n = require('../../data/i18n');
// const languages = require('../../data/languages');
const find_recursive = require('./find');

const parse_infobox = require('./infobox');
const parse_image = require('./image');

const infobox_reg = new RegExp('{{(' + i18n.infoboxes.join('|') + ')[: \n]', 'ig');
const fileRegex = new RegExp('\\[\\[(' + i18n.images.concat(i18n.files).join('|') + ')', 'i');
const img_regex = new RegExp('^(' + i18n.images.concat(i18n.files).join('|') + ')', 'i');
const noWrap_reg = /^\{\{nowrap\|(.*?)\}\}$/;

//reduce the scary recursive situations
const parse_recursive = function(r, wiki) {
  //remove {{template {{}} }} recursions
  r.infoboxes = [];
  let matches = find_recursive('{', '}', wiki);
  matches.forEach(function(s) {
    if (s.match(infobox_reg, 'ig')) {
      var infobox = parse_infobox(s);
      r.infoboxes.push(infobox);
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
    if (s.match(/\[\[([a-z]+):(.*?)\]\]/i) !== null) {
      let site = s.match(/\[\[([a-z]+):/i)[1];
      site = site.toLowerCase();
      if (site && i18n.dictionary[site] === undefined) {
        r.interwiki[site] = s.match(/\[\[([a-z]+):(.*?)\]\]/i)[2];
        wiki = wiki.replace(s, '');
      }
    }
  });

  //add additional image from infobox, if applicable
  if (r.infoboxes[0] && r.infoboxes[0].data && r.infoboxes[0].data['image'] && r.infoboxes[0].data['image'].text) {
    let img = r.infoboxes[0].data['image'].text || '';
    if (typeof img === 'string' && !img.match(img_regex)) {
      img = 'File:' + img;
    }
    r.images.push(img);
  }

  return wiki;
};

module.exports = parse_recursive;
