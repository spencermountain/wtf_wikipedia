const Infobox = require('../infobox/Infobox');
const Reference = require('../reference/Reference');
const getName = require('./parsers/_getName');
const getTemplates = require('./parsers/_getTemplates');

const dates = require('./dates');
const geo = require('./geo');
const inline = require('./inline');
const currencies = require('./currencies');
const misc = require('./misc');
const generic = require('./generic');
const links = require('./links');
const formatting = require('./formatting');
const pronounce = require('./pronounce');
const external = require('./external');
const ignore = require('./ignore');
const wiktionary = require('./wiktionary');

//ensure references and infoboxes at least look valid
const isObject = function(x) {
  return (typeof x === 'object') && (x !== null) && x.constructor.toString().indexOf('Array') === -1;
};

//put them all together
const inlineParsers = Object.assign(
  {},
  dates,
  inline,
  currencies,
  links,
  formatting,
  wiktionary
);
const bigParsers = Object.assign({}, geo, pronounce, misc, external);

//this gets all the {{template}} strings and decides how to parse them
const oneTemplate = function(tmpl, wiki, data, options) {
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
    console.log(name);
  }
  wiki = wiki.replace(tmpl, '');

  return wiki;
};

//reduce the scary recursive situations
const parseTemplates = function(wiki, data, options) {
  let templates = getTemplates(wiki);
  //first, do the nested (second level) ones
  templates.nested.forEach(tmpl => {
    wiki = oneTemplate(tmpl, wiki, data, options);
  });
  //then, reparse wiki for the top-level ones
  templates = getTemplates(wiki);

  //okay if we have a 3-level-deep template, do it again (but no further)
  if (templates.nested.length > 0) {
    templates.nested.forEach(tmpl => {
      wiki = oneTemplate(tmpl, wiki, data, options);
    });
    templates = getTemplates(wiki); //this is getting crazy.
  }
  //okay, top-level
  templates.top.forEach(tmpl => {
    wiki = oneTemplate(tmpl, wiki, data, options);
  });
  //lastly, move citations + infoboxes out of our templates list
  let clean = [];
  data.templates.forEach((o) => {
    //it's possible that we've parsed a reference, that we missed earlier
    if (o.template === 'citation' && o.data && isObject(o.data)) {
      o.data.type = o.type || null;
      data.references.push(new Reference(o));
      return;
    }
    if (o.template === 'infobox' && o.data && isObject(o.data)) {
      data.infoboxes.push(new Infobox(o));
      return;
    }
    clean.push(o);
  });
  data.templates = clean;
  return wiki;
};

module.exports = parseTemplates;
