// const parseCitation = require('./citation');
const keyValue = require('./key-value');

const trim = function(tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '');
  tmpl = tmpl.replace(/\}\}$/, '');
  return tmpl;
};

const grabInside = function(tmpl) {
  tmpl = trim(tmpl);
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
  //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
  'cite gnis': (tmpl, options) => {
    if (options.citations === false) {
      return null;
    }
    tmpl = trim(tmpl);
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
