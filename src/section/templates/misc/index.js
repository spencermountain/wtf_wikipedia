// const parseCitation = require('./citation');
// const parseGeo = require('../geo');
const keyValue = require('../parsers/key-value');
const getInside = require('../parsers/inside');
const pipeSplit = require('../parsers/pipeSplit');

const parsers = {
  // coord: parseGeo,
  main: getInside,
  wide_image: getInside,

  //https://en.wikipedia.org/wiki/Template:IMDb_title
  imdb: (tmpl) => {
    let order = ['id', 'title', 'description', 'section'];
    return pipeSplit(tmpl, order);
  },
  //https://en.wikipedia.org/wiki/Template:Taxon_info
  'taxon info': (tmpl) => {
    let order = ['taxon', 'item'];
    return pipeSplit(tmpl, order);
  },

  //same in every language.
  citation: (tmpl, options) => {
    let data = keyValue(tmpl);
    return {
      template: 'citation',
      data: data
    };
  },
  //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
  'cite gnis': (tmpl, options) => {
    let order = ['id', 'name', 'type'];
    return pipeSplit(tmpl, order);
  }
};
//aliases
parsers['cite'] = parsers.citation;

module.exports = parsers;
