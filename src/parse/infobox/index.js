const i18n = require('../../data/i18n');
const find_recursive = require('../../lib/recursive_match');
const parse_infobox = require('./infobox');

const infobox_reg = new RegExp('{{(' + i18n.infoboxes.join('|') + ')[: \n]', 'ig');
const noWrap_reg = /^\{\{nowrap\|(.*?)\}\}$/;
const main_reg = /^\{\{main( article)?\|(.*?)\}\}$/i;
const wide_img = /^\{\{wide image\|(.*?)\}\}$/i;

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
      //support main
      if (main_reg.test(s) === true) {
        return;
      }
      const wide = s.match(wide_img);
      if (wide) {
        return;
      }
      //if it's not a known template, but it's recursive, remove it
      //(because it will be misread later-on)
      wiki = wiki.replace(s, '');
    }
  });
  // //ok, now that the scary recursion issues are gone, we can trust simple regex methods..
  // //kill the rest of templates
  wiki = wiki.replace(/\{\{(^(main|wide)).*?\}\}/g, '');

  return wiki;
};

module.exports = parse_recursive;
