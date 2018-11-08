const ignore = require('./_ignore');
const getName = require('./_parsers/_getName');

const bigParsers = require('./01-data');
const inlineParsers = require('./02-text');
const generic = require('./03-generic');

//this gets all the {{template}} strings and decides how to parse them
const parseTemplate = function(tmpl, wiki, data, options) {
  let name = getName(tmpl);

  //we explicitly ignore these templates
  if (ignore.hasOwnProperty(name) === true) {
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }

  //string-replacement templates
  if (inlineParsers.hasOwnProperty(name) === true) {
    let str = inlineParsers[name](tmpl, data);
    wiki = wiki.replace(tmpl, str);
    return wiki;
  }

  //section-template parsers
  if (bigParsers.hasOwnProperty(name) === true) {
    let obj = bigParsers[name](tmpl);
    if (obj) {
      data.templates.push(obj);
    }
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }

  //fallback parser
  let obj = generic(tmpl, name);
  if (obj) {
    data.templates.push(obj);
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }
  //bury this template, if we don't know it
  if (options.missing_templates === true) {
    console.log(':: ' + name);
  }
  wiki = wiki.replace(tmpl, '');

  return wiki;
};
module.exports = parseTemplate;
