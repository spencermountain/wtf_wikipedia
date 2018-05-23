const getName = require('../parsers/_getName');
const doKeyValue = require('./KeyValue');
const doListType = require('./listType');

const maybeKeyValue = /\|.+?[a-z].+?=/; // {{name|foo=bar}}

//does it look like {{name|foo|bar}}
const maybePipeList = (tmpl) => {
  let pipes = tmpl.split('|').length;
  if (pipes > 2) {
    let equalSigns = tmpl.split('=').length;
    if (equalSigns <= 2) {
      return true;
    }
  }
  return false;
};

//somehow, we parse this template without knowing how to already
const generic = function(tmpl) {
  let name = getName(tmpl);
  //make sure it looks like a key-value template
  if (maybeKeyValue.test(tmpl) === true) {
    return doKeyValue(tmpl, name);
  }
  if (maybePipeList(tmpl) === true) {
    return doListType(tmpl, name);
  }
  return null;
};
module.exports = generic;
