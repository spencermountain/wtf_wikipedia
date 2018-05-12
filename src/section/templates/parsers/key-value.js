const parseLine = require('../../../sentence').parseLine;
const Sentence = require('../../../sentence/Sentence');

//turn '| key = value' into an object
const keyValue = function(tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '');
  tmpl = tmpl.replace(/\}\}$/, '');
  let arr = tmpl.split(/\n?\|/);
  //look for broken-up links and fix them :(
  arr.forEach((a, i) => {
    if (arr[i + 1] && /\[\[[^\]]+$/.test(a)) { // [[link|text]]
      arr[i + 1] = arr[i] + '|' + arr[i + 1];
      arr[i] = null;
    }
  });
  arr = arr.filter((a) => a && a.indexOf('=') !== -1);
  let obj = arr.reduce((h, line) => {
    let parts = line.split(/=/);
    if (parts.length > 2) {
      parts[1] = parts.slice(1).join('=');
    }
    let key = parts[0].toLowerCase().trim();
    let val = parts[1].trim();
    if (key && val) {
      val = parseLine(val);
      // h[key] = val
      h[key] = new Sentence(val);
    }
    return h;
  }, {});
  return obj;
};
module.exports = keyValue;
