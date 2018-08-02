const strip = require('./_strip');
//
const pipes = function(tmpl) {
  tmpl = strip(tmpl);
  let arr = tmpl.split(/\|/g);
  for(let i = 0; i < arr.length; i += 1) {
    let str = arr[i];
    //stitch [[link|text]] pieces back together
    if (/\[\[[^\]]+$/.test(str) === true && /^[^\[]+\]\]/.test(arr[i + 1]) === true) {
      arr[i] += '|' + arr[i + 1];
      arr[i + 1] = null;
    }
  }
  let name = arr[0] || '';
  return {
    name: name.trim().toLowerCase(),
    list: arr.slice(1)
  };
};
module.exports = pipes;
