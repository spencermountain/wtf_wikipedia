const pipeSplit = require('./parsers/pipeSplit');
//these are insane
// https://en.wikipedia.org/wiki/Template:Tl
const links = [
  'lts',
  't',
  'tfd links',
  'tiw',
  'tltt',
  'tetl',
  'tsetl',
  'ti',
  'tic',
  'tiw',
  'tlt',
  'ttl',
  'twlh',
  'tl2',
  'tlu',
  'demo',
  'hatnote',
  'xpd',
  'para',
  'elc',
  'xtag',
  'mli',
  'mlix',
  '#invoke',
  'url' //https://en.wikipedia.org/wiki/Template:URL
];

//keyValues
const linkTemplates = links.reduce((h, k) => {
  h[k] = (tmpl) => {
    let order = ['first', 'second'];
    let obj = pipeSplit(tmpl, order);
    return obj.second || obj.first;
  };
  return h;
}, {});
module.exports = linkTemplates;
