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
  citation: parseCitation, //same in every language.
  //https://en.wikipedia.org/wiki/Template:Tracklist
  tracklist: (tmpl) => {
    return null;
  // console.log(tmpl);
  },
};
//aliases
parsers['track listing'] = parsers.tracklist;
parsers['cite'] = parsers.citation;
parsers['cite arxiv'] = parsers.citation;
parsers['cite'] = parsers.citation;

module.exports = parsers;
