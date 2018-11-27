const i18n = require('../_data/i18n');
const i18nReg = new RegExp('^(subst.)?(' + i18n.infoboxes.join('|') + ')[: \n]', 'i');
//some looser ones
const startReg = /^infobox /i;
const endReg = / infobox$/i;

//some known ones from
// https://en.wikipedia.org/wiki/Wikipedia:List_of_infoboxes
const known = {
  'gnf protein box': true,
  'automatic taxobox': true,
  'chembox ': true,
  'editnotice': true,
  'geobox': true,
  'hybridbox': true,
  'ichnobox': true,
  'infraspeciesbox': true,
  'mycomorphbox': true,
  'oobox': true,
  'paraphyletic group': true,
  'speciesbox': true,
  'subspeciesbox': true,
  'starbox short': true,
  'taxobox': true
};
//
const isInfobox = function(name) {
  // known
  if (known.hasOwnProperty(name) === true) {
    return true;
  }
  if (i18nReg.test(name)) {
    return true;
  }
  if (startReg.test(name) || endReg.test(name)) {
    return true;
  }
  return false;
};
module.exports = isInfobox;
