const parseCoord = require('./coord');
const strip = require('../parsers/_strip');

//
const geoTemplates = {
  coord: (tmpl) => {
    tmpl = strip(tmpl);
    return parseCoord(tmpl);
  }
};
module.exports = geoTemplates;
