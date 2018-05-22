const getInside = require('../parsers/inside');

//templates that we simply grab their insides as plaintext
let arr = [
  'nowrap',
  'big',
  'cquote',
  'pull quote',
  'small',
  'smaller',
  'midsize',
  'larger',
  'big',
  'bigger',
  'large',
  'huge',
  'resize',
];

//key-values
const templates = arr.reduce((h, k) => {
  h[k] = (tmpl) => getInside(tmpl).data;
  return h;
}, {});

module.exports = templates;
