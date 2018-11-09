const getName = require('../_parsers/_getName');
const pipeList = require('../_parsers/pipeList');
const doKeyValue = require('./keyValue');

const maybeKeyValue = /\| *?[a-z].+= *?[a-z0-9]{2}/i; // {{name|foo=bar}}

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
    return pipeList(tmpl);
  }
  return null;
};
module.exports = generic;
