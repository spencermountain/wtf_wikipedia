const i18n = require('../../data/i18n');
const find_recursive = require('../../lib/recursive_match');
const parse_infobox = require('./infobox');

const infobox_reg = new RegExp('{{(' + i18n.infoboxes.join('|') + ')[: \n]', 'ig');
//dont remove these ones
const keep = {
  'main': true,
  'main article': true,
  'wide image': true,
  'coord': true
};

//reduce the scary recursive situations
const parse_recursive = function(r, wiki, options) {
  //remove {{template {{}} }} recursions
  r.infoboxes = [];
  let matches = find_recursive('{', '}', wiki).filter(s => s[0] && s[1] && s[0] === '{' && s[1] === '{');
  matches.forEach(function(s) {
    if (s.match(infobox_reg, 'ig')) {
      let infobox = parse_infobox(s);
      r.infoboxes.push(infobox);
      wiki = wiki.replace(s, '');
      return;
    }
    //keep these ones, we'll parse them later
    let name = s.match(/^\{\{([^:|\n]+)/);
    if (name !== null) {
      name = name[1].trim().toLowerCase();
      //sorta-keep nowrap template
      if (name === 'nowrap') {
        let inside = s.match(/^\{\{nowrap\|(.*?)\}\}$/)[1];
        wiki = wiki.replace(s, inside);
      }
      if (keep[name] === true) {
        return;
      }
    }
    //let everybody add a custom parser for this template
    if (options.custom) {
      Object.keys(options.custom).forEach((k) => {
        let val = options.custom[k](s);
        if (val || val === false) { //dont store all the nulls
          r.custom[k] = val;
        }
      });
    }
    //if it's not a known template, but it's recursive, remove it
    //(because it will be misread later-on)
    wiki = wiki.replace(s, '');
  });
  // //ok, now that the scary recursion issues are gone, we can trust simple regex methods..
  // //kill the rest of templates
  wiki = wiki.replace(/\{\{(^(main|wide)).*?\}\}/g, '');

  return wiki;
};

module.exports = parse_recursive;
