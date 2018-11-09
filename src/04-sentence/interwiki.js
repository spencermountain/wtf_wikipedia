const languages = require('../_data/languages');
//some colon symbols are valid links, like `America: That place`
//so we have to whitelist allowable interwiki links
const interwikis = [
  'wiktionary',
  'wikinews',
  'wikibooks',
  'wikiquote',
  'wikisource',
  'wikispecies',
  'wikiversity',
  'wikivoyage',
  'wikipedia',
  'wikimedia',
  'foundation',
  'meta',
  'metawikipedia',
  'w',
  'wikt',
  'n',
  'b',
  'q',
  's',
  'v',
  'voy',
  'wmf',
  'c',
  'm',
  'mw',
  'phab',
  'd',
];
let allowed = interwikis.reduce((h, wik) => {
  h[wik] = true;
  return h;
}, {});
//add language prefixes too..
Object.keys(languages).forEach((k) => allowed[k] = true);

//this is predictably very complicated.
// https://meta.wikimedia.org/wiki/Help:Interwiki_linking
const parseInterwiki = function(obj) {
  let str = obj.page || '';
  if (str.indexOf(':') !== -1) {
    let m = str.match(/^(.*):(.*)/);
    if (m === null) {
      return obj;
    }
    let site = m[1] || '';
    site = site.toLowerCase();
    //only allow interwikis to these specific places
    if (allowed.hasOwnProperty(site) === false) {
      return obj;
    }
    obj.wiki = site;
    obj.page = m[2];
  }
  return obj;
};
module.exports = parseInterwiki;
