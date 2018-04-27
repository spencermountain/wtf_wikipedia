const setDefaults = require('../../lib/setDefaults');
const defaults = {
  text: true,
  links: true,
  formatting: true,
  dates: true,
};

const toJSON = function(s, options) {
  options = setDefaults(options, defaults);
  let data = {};
  if (options.text || options.plaintext) {
    data.text = s.plaintext();
  }
  if (options.links && s.data.links) {
    data.links = s.links();
  }
  if (options.formatting && s.data.fmt) {
    data.formatting = s.data.fmt;
  }
  if (options.dates && s.data.dates) {
    data.dates = s.data.dates;
  }
  return data;
};
module.exports = toJSON;
