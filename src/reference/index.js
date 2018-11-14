const parseGeneric = require('../templates/_parsers/generic');
const pipeSplit = require('../templates/_parsers/pipeSplit');
const parseSentence = require('../04-sentence').oneSentence;
const Reference = require('./Reference');

//structured Cite templates - <ref>{{Cite..</ref>
const hasCitation = function(str) {
  return /^ *?\{\{ *?(cite|citation)/i.test(str) && /\}\} *?$/.test(str) && /citation needed/i.test(str) === false;
};

//might as well parse it, since we're here.
const parseCitation = function(tmpl) {
  let obj = parseGeneric(tmpl);
  if (obj) {
    return obj;
  }
  //support {{cite gnis|98734}} format (yuck!)
  let order = ['id', 'name', 'type'];
  let data = pipeSplit(tmpl, order);
  return {
    template: 'citation',
    type: 'gnis',
    data: data
  };
};

//handle unstructured ones - <ref>some text</ref>
const parseInline = function(str) {
  let obj = parseSentence(str) || {};
  return {
    template: 'citation',
    type: 'inline',
    data: {},
    inline: obj
  };
};

// parse <ref></ref> xml tags
const parseRefs = function(wiki, data) {
  let references = [];
  wiki = wiki.replace(/ ?<ref>([\s\S]{0,1800}?)<\/ref> ?/gi, function(a, tmpl) {
    if (hasCitation(tmpl)) {
      let obj = parseCitation(tmpl);
      if (obj) {
        references.push(obj);
      }
      wiki = wiki.replace(tmpl, '');
    } else {
      references.push(parseInline(tmpl));
    }
    return ' ';
  });
  // <ref name=""/>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?\/> ?/gi, ' ');
  // <ref name=""></ref>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?>([\s\S]{0,1800}?)<\/ref> ?/gi, function(a, tmpl) {
    if (hasCitation(tmpl)) {
      let obj = parseCitation(tmpl);
      if (obj) {
        references.push(obj);
      }
      wiki = wiki.replace(tmpl, '');
    } else {
      references.push(parseInline(tmpl));
    }
    return ' ';
  });
  //now that we're done with xml, do a generic + dangerous xml-tag removal
  wiki = wiki.replace(/ ?<[ \/]?[a-z0-9]{1,8}[a-z0-9=" ]{2,20}[ \/]?> ?/g, ' '); //<samp name="asd">
  data.references = references.map(r => new Reference(r));
  return wiki;
};
module.exports = parseRefs;
