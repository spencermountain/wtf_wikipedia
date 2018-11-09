const setDefaults = require('../_lib/setDefaults');

const defaults = {
  sentences: true
};

const toJson = function(p, options) {
  options = setDefaults(options, defaults);
  let data = {};
  if (options.sentences === true) {
    data.sentences = p.sentences().map(s => s.json(options));
  }
  return data;
};
module.exports = toJson;
