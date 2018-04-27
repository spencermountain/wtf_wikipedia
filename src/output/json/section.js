const setDefaults = require('../../lib/setDefaults');
const defaults = {
  title: true,
  depth: true,
  sentences: true,
  links: true,
  text: true,
  formatting: true,
  dates: true,
};
//
const toJSON = function(s, options) {
  options = setDefaults(options, defaults);
  let data = {};
  if (options.title) {
    data.title = s.title();
  }
  if (options.sentences) {
    data.sentences = s.sentences(options);
  }
  return data;
};
module.exports = toJSON;
