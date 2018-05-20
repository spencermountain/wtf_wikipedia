// const parseCitation = require('./citation');
const keyValue = require('./key-value');
const parseGeo = require('./geo');
const getInside = require('./_getInside');
const pipeSplit = require('./pipeSplit');

const parsers = {
  coord: parseGeo,
  main: getInside,
  wide_image: getInside,

  //https://en.wikipedia.org/wiki/Template:IMDb_title
  imdb: (tmpl) => {
    let order = ['id', 'title', 'description', 'section'];
    return pipeSplit(tmpl, order);
  },

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
  //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
  'cite gnis': (tmpl, options) => {
    if (options.citations === false) {
      return null;
    }
    let order = ['id', 'name', 'type'];
    return pipeSplit(tmpl, order);
  }
};
//aliases
parsers['cite'] = parsers.citation;

module.exports = parsers;
