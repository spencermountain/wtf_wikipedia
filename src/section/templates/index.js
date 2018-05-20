// const findRecursive = require('../../lib/recursive_match');
const getName = require('./parsers/_getName');
const getTemplates = require('./getTemplates');

const dates = require('./dates');
const geo = require('./geo');
const inline = require('./inline');
const misc = require('./misc');
const generic = require('./generic');
// const infoboxes = require('./infobox');

const doTemplate = function(tmpl, wiki, r) {
  let name = getName(tmpl);

  //date templates
  if (dates.hasOwnProperty(name)) {
    let str = dates[name](tmpl, r);
    wiki = wiki.replace(tmpl, str);
    return wiki;
  }
  //geo templates
  if (geo.hasOwnProperty(name)) {
    let obj = geo[name](tmpl);
    if (obj) {
      r.templates.push(obj);
    }
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }
  //inline templates
  if (inline.hasOwnProperty(name)) {
    let str = inline[name](tmpl);
    wiki = wiki.replace(tmpl, str);
    return wiki;
  }
  //other ones
  if (misc.hasOwnProperty(name)) {
    let obj = misc[name](tmpl);
    if (obj) {
      r.templates.push(obj);
    }
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }
  let obj = generic(tmpl, name);
  if (obj) {
    r.templates.push(obj);
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }

  //bury this template, if we don't know it
  console.log(`  - no parser for '${name}' -`);
  console.log('');
  wiki = wiki.replace(tmpl, '');

  return wiki;
};

//reduce the scary recursive situations
const allTemplates = function(r, wiki, options) {
  let templates = getTemplates(wiki);
  //first, do the nested ones
  templates.nested.forEach((tmpl) => {
    wiki = doTemplate(tmpl, wiki, r, options);
  });
  //then, reparse wiki for the top-level ones
  templates = getTemplates(wiki);
  templates.top.forEach((tmpl) => {
    wiki = doTemplate(tmpl, wiki, r, options);
  });
  //grab {{template {{}} }} recursions
  // let matches = findRecursive('{', '}', wiki);
  // matches = matches.filter(s => s[0] && s[1] && s[0] === '{' && s[1] === '{');
  // //ok, go through each one...
  // matches.forEach(function(tmpl) {
  //   let name = getName(tmpl);
  //   //what the-
  //   if (!name) {
  //     wiki = wiki.replace(tmpl, '');
  //     return;
  //   }
  //   //for-sure do all of these guys
  //   if (infoBx.isInfobox(name)) {
  //     if (options.infoboxes !== false) {
  //       r.templates.push({
  //         template: 'infobox',
  //         type: infoBx.templateName(name),
  //         data: keyValue(tmpl)
  //       });
  //     }
  //     wiki = wiki.replace(tmpl, '');
  //     return;
  //   }
  //
  //   //parse this template
  //   if (parsers.hasOwnProperty(name) === true) {
  //     let template = parsers[name](trim(tmpl), options);
  //     if (template) {
  //       r.templates.push(template);
  //     }
  //     //remove it from the wiki document
  //     wiki = wiki.replace(tmpl, '');
  //     return;
  //   }
  //   //here: add custom parser support?
  //   let obj = generic(tmpl, options);
  //   if (obj) {
  //     r.templates.push(obj);
  //     wiki = wiki.replace(tmpl, '');
  //     return;
  //   }
  //
  //   //if it's not a known template, but it's recursive, remove it
  //   //(because it will be misread later-on)
  //   wiki = wiki.replace(tmpl, '');
  // });
  // // //ok, now that the scary recursion issues are gone, we can trust simple regex methods..
  // // //kill the rest of templates
  // wiki = wiki.replace(/\{\{ *?(^(main|wide)).*?\}\}/g, ''); //TODO:fix me
  return wiki;
};

module.exports = allTemplates;
