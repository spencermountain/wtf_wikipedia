const ignore = require('./_ignore');
const startEnd = require('./start-end');
const getName = require('./_parsers/_getName');
const parse = require('./_parsers/parse');

const templates = Object.assign({},
  require('./wikipedia'),
  require('./identities'),
  require('./dates'),
  require('./formatting'),
  require('./geo'),
  require('./language'),
  require('./money'),
  require('./sports'),
  require('./science'),
  require('./math'),
  require('./politics'),
  require('./misc')
);
// console.log(Object.keys(templates).length + ' Templates!');

const generic = require('./_generic');

//this gets all the {{template}} strings and decides how to parse them
const parseTemplate = function(tmpl, wiki, data, options) {
  let name = getName(tmpl);
  //we explicitly ignore these templates
  if (ignore.hasOwnProperty(name) === true) {
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }

  //match any known template forms (~1,000!)
  if (templates.hasOwnProperty(name) === true) {
    let str = templates[name](tmpl, data);
    wiki = wiki.replace(tmpl, str);
    return wiki;
  }
  //cite book, cite arxiv...
  if (/^cite [a-z]/.test(name) === true) {
    let obj = parse(tmpl, data);
    data.templates.push(obj);
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }
  // {{template start}}...{{template end}}
  if (/ (start|begin)$/.test(name) === true) {
    wiki = startEnd(tmpl, wiki, name, data);
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
