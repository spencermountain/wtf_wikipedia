const setDefaults = require('../_lib/setDefaults');

const defaults = {
  sentences: true
};

const toMarkdown = function(p, options) {
  options = setDefaults(options, defaults);
  let md = '';
  if (options.sentences === true) {
    md += p.sentences().reduce((str, s) => {
      str += s.markdown(options) + '\n';
      return str;
    }, {});
  }
  return md;
};
module.exports = toMarkdown;
