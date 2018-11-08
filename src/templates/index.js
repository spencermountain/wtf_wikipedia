const Infobox = require('../infobox/Infobox');
const Reference = require('../reference/Reference');
const getTemplates = require('./_parsers/_getTemplates');
const parseTemplate = require('./parse');

//ensure references and infoboxes at least look valid
const isObject = function(x) {
  return (typeof x === 'object') && (x !== null) && x.constructor.toString().indexOf('Array') === -1;
};

//reduce the scary recursive situations
const parseTemplates = function(wiki, data, options) {
  let templates = getTemplates(wiki);
  //first, do the nested (second level) ones
  templates.nested.forEach(tmpl => {
    wiki = parseTemplate(tmpl, wiki, data, options);
  });
  //then, reparse wiki for the top-level ones
  templates = getTemplates(wiki);

  //okay if we have a 3-level-deep template, do it again (but no further)
  if (templates.nested.length > 0) {
    templates.nested.forEach(tmpl => {
      wiki = parseTemplate(tmpl, wiki, data, options);
    });
    templates = getTemplates(wiki); //this is getting crazy.
  }
  //okay, top-level
  templates.top.forEach(tmpl => {
    wiki = parseTemplate(tmpl, wiki, data, options);
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
