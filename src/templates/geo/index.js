const parseCoordAndCoor = require('./coor');
const strip = require('../_parsers/_strip');

//
const geoTemplates = {
  coord: (tmpl, r) => {
    tmpl = strip(tmpl);
    let obj = parseCoordAndCoor(tmpl);
    r.templates.push(obj);
    return '';
  },
  // these are from the nl wiki
  'coor title dms': (tmpl, r) => {
    tmpl = strip(tmpl);
    let obj = parseCoordAndCoor(tmpl);
    r.templates.push(obj);
    return '';
  },
  'coor title dec': (tmpl, r) => {
    tmpl = strip(tmpl);
    let obj = parseCoordAndCoor(tmpl);
    r.templates.push(obj);
    return '';
  },
  'coor dms': (tmpl, r) => {
    tmpl = strip(tmpl);
    let obj = parseCoordAndCoor(tmpl);
    r.templates.push(obj);
    return '';
  },
  'coor dm': (tmpl, r) => {
    tmpl = strip(tmpl);
    let obj = parseCoordAndCoor(tmpl);
    r.templates.push(obj);
    return '';
  },
  'coor dec': (tmpl, r) => {
    tmpl = strip(tmpl);
    let obj = parseCoordAndCoor(tmpl);
    r.templates.push(obj);
    return '';
  }
};
module.exports = geoTemplates;
