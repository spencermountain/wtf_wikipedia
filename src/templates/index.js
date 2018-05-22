// const findRecursive = require('../../lib/recursive_match');
const getName = require('./parsers/_getName');
const getTemplates = require('./getTemplates');

const dates = require('./dates');
const geo = require('./geo');
const inline = require('./inline');
const misc = require('./misc');
const generic = require('./generic');
const links = require('./links');
const formatting = require('./formatting');
const interwiki = require('./interwiki');
const ipa = require('./ipa');

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
  if (ipa.hasOwnProperty(name)) {
    let obj = ipa[name](tmpl);
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
  //inline templates
  if (links.hasOwnProperty(name)) {
    let str = links[name](tmpl);
    wiki = wiki.replace(tmpl, str);
    return wiki;
  }
  //inline formatting templates
  if (formatting.hasOwnProperty(name)) {
    let str = formatting[name](tmpl);
    wiki = wiki.replace(tmpl, str);
    return wiki;
  }
  if (interwiki.hasOwnProperty(name)) {
    let str = interwiki[name](tmpl);
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
  // console.log(templates);
  //first, do the nested ones
  templates.nested.forEach((tmpl) => {
    wiki = doTemplate(tmpl, wiki, r, options);
  });
  // console.log(wiki);
  //then, reparse wiki for the top-level ones
  templates = getTemplates(wiki);
  templates.top.forEach((tmpl) => {
    wiki = doTemplate(tmpl, wiki, r, options);
  });
  return wiki;
};

module.exports = allTemplates;
