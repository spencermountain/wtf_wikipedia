// const parseCitation = require('./citation');
// const parseGeo = require('../geo');
const keyValue = require('./parsers/keyValue');
const getInside = require('./parsers/inside');
const pipeSplit = require('./parsers/pipeSplit');
const pipeList = require('./parsers/pipeList');

const parsers = {

  'book bar': pipeList,

  main: (tmpl) => {
    let obj = getInside(tmpl);
    return {
      template: 'main',
      page: obj.data
    };
  },
  wide_image: (tmpl) => {
    let obj = getInside(tmpl);
    return {
      template: 'wide_image',
      image: obj.data
    };
  },

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
  citation: (tmpl) => {
    let data = keyValue(tmpl);
    return {
      template: 'citation',
      data: data
    };
  },
  //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
  'cite gnis': (tmpl) => {
    let order = ['id', 'name', 'type'];
    let obj = pipeSplit(tmpl, order);
    obj.template = 'citation';
    obj.type = 'gnis';
    return obj;
  },

};
//aliases
parsers['cite'] = parsers.citation;

module.exports = parsers;
