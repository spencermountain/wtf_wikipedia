const parseCoord = require('./coord');
const parseCoor = require('./coor');
const strip = require('../parsers/_strip');

//
const geoTemplates = {
  coord: (tmpl) => {
    tmpl = strip(tmpl);
    return parseCoord(tmpl);
  },
  // these are from the nl wiki
  'coor title dms': (tmpl) => {
    tmpl = strip(tmpl);
    return parseCoor(tmpl);
  },
  'coor title dec': (tmpl) => {
    tmpl = strip(tmpl);
    return parseCoor(tmpl);
  },
  'coor dms': (tmpl) => {
    tmpl = strip(tmpl);
    return parseCoor(tmpl);
  },
  'coor dm': (tmpl) => {
    tmpl = strip(tmpl);
    return parseCoor(tmpl);
  },
  'coor dec': (tmpl) => {
    tmpl = strip(tmpl);
    return parseCoor(tmpl);
  }
};
module.exports = geoTemplates;
