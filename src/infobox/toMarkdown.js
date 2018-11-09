const dontDo = require('./_skip-keys');
const pad = require('../_lib/pad');
const setDefaults = require('../_lib/setDefaults');
const defaults = {
  images: true,
};

// render an infobox as a table with two columns, key + value
const doInfobox = function(obj, options) {
  options = setDefaults(options, defaults);
  let md = '|' + pad('', 35) + '|' + pad('', 30) + '|\n';
  md += '|' + pad('---', 35) + '|' + pad('---', 30) + '|\n';
  //todo: render top image here (somehow)
  Object.keys(obj.data).forEach((k) => {
    if (dontDo[k] === true) {
      return;
    }
    let key = '**' + k + '**';
    let s = obj.data[k];
    let val = s.markdown(options);
    //markdown is more newline-sensitive than wiki
    val = val.split(/\n/g).join(', ');
    md += '|' + pad(key, 35) + '|' + pad(val, 30) + ' |\n';
  });
  return md;
};
module.exports = doInfobox;
