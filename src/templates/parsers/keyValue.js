const parseLine = require('../../sentence').parseLine;
const Sentence = require('../../sentence/Sentence');
const strip = require('./_strip');

//turn '| key = value' into an object
const keyValue = function(tmpl, isInfobox) {
  tmpl = strip(tmpl);
  let arr = tmpl.split(/\n?\|/);
  //look for broken-up links and fix them :(
  arr.forEach((a, i) => {
    if (!arr[i + 1]) {
      return;
    }
    if (/\[\[[^\]]+$/.test(a) || /\{\{[^\}]+$/.test(a)) { // [[link|text]] or {{imdb|2386}}
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
      if (isInfobox) {
        h[key] = new Sentence(val); //.json();
      } else {
        h[key] = val.text;
        if (val.links) {
          h._links = h._links || [];
          h._links = h._links.concat(val.links);
        }
      }
    }
    return h;
  }, {});
  return obj;
};
module.exports = keyValue;
