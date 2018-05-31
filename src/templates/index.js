// const findRecursive = require('../../lib/recursive_match');
const getName = require('./parsers/_getName');
const getTemplates = require('./parsers/_getTemplates');

const dates = require('./dates');
const geo = require('./geo');
const inline = require('./inline');
const misc = require('./misc');
const generic = require('./generic');
const links = require('./links');
const formatting = require('./formatting');
const pronounce = require('./pronounce');
const external = require('./external');
const ignore = require('./ignore');

//put them all together
const inlineParsers = Object.assign({}, dates, inline, links, formatting);
const bigParsers = Object.assign({}, geo, pronounce, misc, external);

const doTemplate = function(tmpl, wiki, r) {
  let name = getName(tmpl);
  //we explicitly ignore these templates
  if (ignore.hasOwnProperty(name) === true) {
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }
  //string-replacement templates
  if (inlineParsers.hasOwnProperty(name) === true) {
    let str = inlineParsers[name](tmpl, r);
    wiki = wiki.replace(tmpl, str);
    return wiki;
  }
  //section-template parsers
  if (bigParsers.hasOwnProperty(name) === true) {
    let obj = bigParsers[name](tmpl);
    if (obj) {
      r.templates.push(obj);
    }
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }
  //fallback parser
  let obj = generic(tmpl, name);
  if (obj) {
    r.templates.push(obj);
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }
  //bury this template, if we don't know it
  // console.log(`  - no parser for '${name}' -`);
  // console.log('');
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
