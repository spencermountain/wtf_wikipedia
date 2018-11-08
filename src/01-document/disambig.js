const i18n = require('../_data/i18n');
const template_reg = new RegExp('\\{\\{ ?(' + i18n.disambigs.join('|') + ')(\\|[a-z, =]*?)? ?\\}\\}', 'i');

//special disambig-templates en-wikipedia uses
let d = ' disambiguation';
const english = [
  'airport',
  'biology' + d,
  'call sign' + d,
  'caselaw' + d,
  'chinese title' + d,
  'dab',
  'dab',
  'disamb',
  'disambig',
  'disambiguation cleanup',
  'genus' + d,
  'geodis',
  'hndis',
  'hospital' + d,
  'lake index',
  'letter' + d,
  'letter-number combination' + d,
  'mathematical' + d,
  'military unit' + d,
  'mountainindex',
  'number' + d,
  'phonetics' + d,
  'place name' + d,
  'place name' + d,
  'portal' + d,
  'road' + d,
  'school' + d,
  'setindex',
  'ship index',
  'species latin name abbreviation' + d,
  'species latin name' + d,
  'split dab',
  'sport index',
  'station' + d,
  'synagogue' + d,
  'taxonomic authority' + d,
  'taxonomy' + d,
  'wp disambig',
];
const enDisambigs = new RegExp('\\{\\{ ?(' + english.join('|') + ')(\\|[a-z, =]*?)? ?\\}\\}', 'i');

const isDisambig = function(wiki) {
  //test for {{disambiguation}} templates
  if (template_reg.test(wiki) === true) {
    return true;
  }
  //more english-centric disambiguation templates

  //{{hndis}}, etc
  if (enDisambigs.test(wiki) === true) {
    return true;
  }

  //try 'may refer to' on first line for en-wiki?
  // let firstLine = wiki.match(/^.+?\n/);
  // if (firstLine !== null && firstLine[0]) {
  //   if (/ may refer to/i.test(firstLine) === true) {
  //     return true;
  //   }
  // }
  return false;
};

module.exports = {
  isDisambig: isDisambig
};
