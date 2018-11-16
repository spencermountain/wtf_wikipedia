const i18n = require('../../_data/i18n');
const isInfobox = new RegExp('^(subst.)?(' + i18n.infoboxes.join('|') + ')[: \n]', 'i');
const isReference = new RegExp('^(cite |citation)', 'i');

// some templates are kind-of special
const isKnown = function(obj ) {
  let name = obj.template || '';
  //we treat infoboxes with special-attention..
  if (isInfobox.test(name) === true) {
    return 'infobox';
  }
  //references, too. Special.
  if (isReference.test(name) === true) {
    return 'reference';
  }
  return false;
};
module.exports = isKnown;
