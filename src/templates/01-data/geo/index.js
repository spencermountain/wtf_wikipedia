const parseCoordAndCoor = require('./coor');
const strip = require('../../_parsers/_strip');

//
const geoTemplates = {
  coord: (tmpl) => {
    tmpl = strip(tmpl);
    return parseCoordAndCoor(tmpl);
  },
  // these are from the nl wiki
  'coor title dms': (tmpl) => {
    tmpl = strip(tmpl);
    return parseCoordAndCoor(tmpl);
  },
  'coor title dec': (tmpl) => {
    tmpl = strip(tmpl);
    return parseCoordAndCoor(tmpl);
  },
  'coor dms': (tmpl) => {
    tmpl = strip(tmpl);
    return parseCoordAndCoor(tmpl);
  },
  'coor dm': (tmpl) => {
    tmpl = strip(tmpl);
    return parseCoordAndCoor(tmpl);
  },
  'coor dec': (tmpl) => {
    tmpl = strip(tmpl);
    return parseCoordAndCoor(tmpl);
  }
};
module.exports = geoTemplates;
