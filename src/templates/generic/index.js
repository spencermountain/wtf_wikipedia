const i18n = require('../../data/i18n');
const keyValue = require('../parsers/key-value');
const getName = require('../parsers/_getName');
const is_infobox = new RegExp('^(subst.)?(' + i18n.infoboxes.join('|') + ')[: \n]', 'i');
const is_citation = new RegExp('^(cite |citation)', 'i');

const maybeKeyValue = /\|.+?[a-z].+?=/; // (|foo=)

const infoboxType = function(name) {
  const reg = new RegExp('^(subst.)?(' + i18n.infoboxes.join('|') + ') +?', 'i');
  name = name.replace(reg, '');
  return name.trim();
};

//somehow, we parse this template without knowing how to already
const generic = function(tmpl) {
  let name = getName(tmpl);
  //make sure it looks like a key-value template
  if (maybeKeyValue.test(tmpl) === true) {
    let data = keyValue(tmpl);

    //handle citation templates
    if (is_citation.test(name)) {
      let type = name.replace(/^cite +/, '').trim();
      return {
        template: 'citation',
        type: type,
        data: data
      };
    }

    //handle infoboxes
    if (is_infobox.test(name)) {
      return {
        template: 'infobox',
        type: infoboxType(name),
        data: data
      };
    }

    //generic response
    return {
      template: name,
      data: data
    };
  }
  return null;
};
module.exports = generic;
