const parseCitation = require('./citation');
const parseLine = require('../../sentence').parseLine;

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

//turn '| key = value' into an object
const keyValue = function(tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '');
  tmpl = tmpl.replace(/\}\}$/, '');
  let arr = tmpl.split(/\n?\|/);
  arr = arr.filter(line => line.indexOf('=') !== -1);
  let obj = arr.reduce((h, line) => {
    let parts = line.split(/=/);
    if (parts.length > 1) {
      let key = parts[0].trim();
      let val = parseLine(parts[1].trim());
      h[key] = val;
    }
    return h;
  }, {});
  return obj;
};

const parsers = {
  main: grabInside,
  wide_image: grabInside,

  citation: parseCitation, //same in every language.

  //https://en.wikipedia.org/wiki/Template:Tracklist
  tracklist: (tmpl) => {
    let data = keyValue(tmpl);
    return {
      template: 'tracklist',
      data: data
    };
  }
};
//aliases
parsers['track listing'] = parsers.tracklist;
parsers['cite'] = parsers.citation;

module.exports = parsers;
