const findRecursive = require('../../lib/recursive_match');
// const parseInfobox = require('../../infobox/parse-infobox');
const infoBx = require('./infobox');
//create a list of templates we can understand, and will parse later
let inlineTemplates = require('../../sentence/templates/templates');
const parsers = require('./parsers');
const getName = require('./parsers/_getName');
const keyValue = require('./parsers/key-value');
const generic = require('./parsers/generic');

//reduce the scary recursive situations
const findTemplates = function(r, wiki, options) {

  //grab {{template {{}} }} recursions
  let matches = findRecursive('{', '}', wiki);
  matches = matches.filter(s => s[0] && s[1] && s[0] === '{' && s[1] === '{');

  //ok, go through each one...
  matches.forEach(function(tmpl) {
    let name = getName(tmpl);
    //this must be junk
    if (name === null) {
      wiki = wiki.replace(tmpl, '');
      return;
    }
    //for-sure do all of these guys
    if (infoBx.isInfobox(name)) {
      if (options.infoboxes !== false) {
        r.templates.push({
          template: 'infobox',
          type: infoBx.templateName(name),
          data: keyValue(tmpl)
        });
      }
      wiki = wiki.replace(tmpl, '');
      return;
    }

    //sorta-keep this nowrap template
    if (name === 'nowrap') {
      let inside = tmpl.match(/^\{\{nowrap *?\|(.*?)\}\}$/);
      if (inside) {
        wiki = wiki.replace(tmpl, inside[1]);
        return;
      }
    }
    //parse this template
    if (parsers.hasOwnProperty(name) === true) {
      let template = parsers[name](tmpl, options);
      if (template) {
        r.templates.push(template);
      }
      //remove it from the wiki document
      wiki = wiki.replace(tmpl, '');
      return;
    }
    //do these later?
    if (inlineTemplates.hasOwnProperty(name) === true) {
      return;
    }
    //here: add custom parser support?
    let obj = generic(tmpl, options);
    if (obj) {
      r.templates.push(obj);
      wiki = wiki.replace(tmpl, '');
      return;
    }

    //if it's not a known template, but it's recursive, remove it
    //(because it will be misread later-on)
    wiki = wiki.replace(tmpl, '');
  });
  // //ok, now that the scary recursion issues are gone, we can trust simple regex methods..
  // //kill the rest of templates
  wiki = wiki.replace(/\{\{ *?(^(main|wide)).*?\}\}/g, ''); //TODO:fix me
  return wiki;
};

module.exports = findTemplates;
