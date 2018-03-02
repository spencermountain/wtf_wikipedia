const doSentence = require('./sentence');
const pad = require('./pad');

const dontDo = {
  image: true,
  caption: true
};

// render an infobox as a table with two columns, key + value
const doInfobox = function(obj, options) {
  let md = '|' + pad('', 25) + '|' + pad('', 30) + '|\n';
  md += '|' + pad('---', 25) + '|' + pad('---', 30) + '|\n';
  Object.keys(obj.data).forEach((k) => {
    if (dontDo[k] === true) {
      return;
    }
    let key = '**' + k + '**';
    let val = doSentence(obj.data[k], options);
    md += '|' + pad(key, 25) + '|' + pad(val, 30) + ' |\n';

  });
  return md;
};
module.exports = doInfobox;
