const parseCitation = require('./templates/parsers/citation');
const parseLine = require('../sentence').parseLine;

//structured Cite templates - <ref>{{Cite..</ref>
const hasCitation = function(str) {
  return /^ *?\{\{ *?(cite|citation)/i.test(str) && /\}\} *?$/.test(str) && /citation needed/i.test(str) === false;
};
//handle unstructured ones - <ref>some text</ref>
const parseInline = function(tmpl, r, options) {
  if (options.citations === false) {
    return;
  }
  let obj = parseLine(tmpl) || {};
  let cite = {
    type: 'inline',
    text: obj.text
  };
  if (obj.links && obj.links.length) {
    let extern = obj.links.find(f => f.site);
    if (extern) {
      cite.url = extern.site;
    }
  }
  r.templates.push({
    template: 'citation',
    data: cite
  });
};

// parse <ref></ref> xml tags
const parseRefs = function(r, wiki, options) {
  wiki = wiki.replace(/ ?<ref>([\s\S]{0,750}?)<\/ref> ?/gi, function(a, tmpl) {
    if (hasCitation(tmpl)) {
      let obj = parseCitation(tmpl, options);
      if (obj) {
        r.templates.push(obj);
      }
    // wiki = wiki.replace(tmpl, '');
    } else {
      parseInline(tmpl, r, options);
    }
    return ' ';
  });
  // <ref name=""/>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?\/> ?/gi, ' ');
  // <ref name=""></ref>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?>([\s\S]{0,1000}?)<\/ref> ?/gi, function(a, tmpl) {
    if (hasCitation(tmpl)) {
      let obj = parseCitation(tmpl, options);
      if (obj) {
        r.templates.push(obj);
      }
      wiki = wiki.replace(tmpl, '');
    } else {
      parseInline(tmpl, r, options);
    }
    return ' ';
  });
  //now that we're done with xml, do a generic + dangerous xml-tag removal
  wiki = wiki.replace(/ ?<[ \/]?[a-z0-9]{1,8}[ \/]?> ?/g, ' '); //<samp>
  return wiki;
};
module.exports = parseRefs;
