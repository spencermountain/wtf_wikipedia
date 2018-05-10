const parseCitation = require('./citation');

const generic = function(tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '');
  tmpl = tmpl.replace(/\}\}$/, '');
  let parts = tmpl.split('|');
  if (typeof parts[1] !== 'string') {
    return null;
  }
  return {
    template: parts[0].trim().toLowerCase(),
    data: parts[1].trim()
  };
};

const parsers = {
  main: generic,
  wide_image: generic,
  tracklist: (tmpl) => {
    return generic(tmpl);
  },
  cite: parseCitation, //same in every language.
  citation: parseCitation,
};

module.exports = parsers;
