const setDefaults = require('../lib/setDefaults');

const defaults = {
  sentences: true
};

const toLatex = function(p, options) {
  options = setDefaults(options, defaults);
  let md = '';
  if (options.sentences === true) {
    md += p.sentences().reduce((str, s) => {
      str += s.latex(options) + '\n';
      return str;
    }, {});
  }
  return md;
};
module.exports = toLatex;
