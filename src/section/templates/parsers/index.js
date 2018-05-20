// const parseCitation = require('./citation');
const keyValue = require('./key-value');
const parseGeo = require('./geo');

const grabInside = function(tmpl) {
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
  coord: parseGeo,
  main: grabInside,
  wide_image: grabInside,

  imdb: (tmpl) => {
    let arr = tmpl.split(/\|/g);
    let obj = {
      template: 'imdb',
    };
    if (arr[0]) {
      obj.type = arr[0].trim().replace(/^imdb +/i, '');
    }
    if (arr[1]) { //id
      obj.id = arr[1].trim().replace(/^.+= +/i, '');
    }
    if (arr[2]) { //title
      obj.title = arr[2].trim().replace(/^.+= +/i, '');
    }
    if (arr[3]) { //description
      obj.description = arr[3].trim().replace(/^.+= +/i, '');
    }
    return obj;
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
    let arr = tmpl.split('|');
    return {
      template: 'citation',
      data: {
        id: arr[1],
        name: arr[2],
        type: arr[3],
      }
    };
  }
};
//aliases
parsers['cite'] = parsers.citation;

module.exports = parsers;
