const setDefaults = require('../_lib/setDefaults');
const defaults = {
  text: true,
  links: true,
  formatting: true,
  dates: true,
};

const toJSON = function(s, options) {
  options = setDefaults(options, defaults);
  let data = {};
  if (options.text) {
    data.text = s.plaintext();
  }
  if (options.links && s.links().length > 0) {
    data.links = s.links();
  }
  if (options.formatting && s.data.fmt) {
    data.formatting = s.data.fmt;
  }
  if (options.dates && s.data.dates !== undefined) {
    data.dates = s.data.dates;
  }
  return data;
};
module.exports = toJSON;
