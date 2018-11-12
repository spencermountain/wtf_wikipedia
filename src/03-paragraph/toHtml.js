const setDefaults = require('../_lib/setDefaults');

const defaults = {
  sentences: true
};

const toHtml = function(p, options) {
  options = setDefaults(options, defaults);
  let html = '';
  if (options.sentences === true) {
    html += p.sentences().map(s => s.html(options)).join('\n');
  }
  return html;
};
module.exports = toHtml;
