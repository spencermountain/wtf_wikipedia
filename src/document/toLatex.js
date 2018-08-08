const setDefaults = require('../lib/setDefaults');

const defaults = {
  infoboxes: true,
  tables: true,
  lists: true,
  title: true,
  images: true,
  links: true,
  formatting: true,
  sentences: true,
};

//
const toLatex = function(doc, options) {
  options = setDefaults(options, defaults);
  let data = doc.data;
  let out = '';
  //add the title on the top
  // if (options.title === true && data.title) {
  //   out += '\\section{' + data.title + '}\n';
  // }
  //render infoboxes (up at the top)
  if (options.infoboxes === true && data.infoboxes) {
    out += data.infoboxes.map(i => i.latex(options)).join('\n');
  }
  //render each section
  out += doc.sections().map(s => s.latex(options)).join('\n');
  return out;
};
module.exports = toLatex;
