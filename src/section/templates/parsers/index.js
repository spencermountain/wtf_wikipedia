// const parseCitation = require('./citation');
const keyValue = require('./key-value');

const grabInside = function(tmpl) {
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
  main: grabInside,
  wide_image: grabInside,

  //same in every language.
  citation: (tmpl, options) => {
    if (options.citations === false) {
      return null;
    }
    let data = keyValue(tmpl);
    return {
      template: 'citation',
      data: data
    };
  },

//https://en.wikipedia.org/wiki/Template:Tracklist
// tracklist: (tmpl) => {
//   let data = keyValue(tmpl);
//   return {
//     template: 'tracklist',
//     data: data
//   };
// }
};
//aliases
// parsers['track listing'] = parsers.tracklist;
parsers['cite'] = parsers.citation;

module.exports = parsers;
