const parseCoord = require('./coord');

const strip = function(tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '');
  tmpl = tmpl.replace(/\}\}$/, '');
  return tmpl;
};

//
const geoTemplates = {
  coord: (tmpl) => {
    tmpl = strip(tmpl);
    return parseCoord(tmpl);
  }
};
module.exports = geoTemplates;
