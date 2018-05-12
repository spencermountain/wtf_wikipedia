//grab the {{cite web}} templates, etc
const parseCitation = function(str, options) {
  //remove it from main
  // wiki = wiki.replace(str, '');
  if (options.citations === false) {
    return null;
  }
  //trim start {{ and
  //trim end }}
  str = str.replace(/^\{\{ *?/, '');
  str = str.replace(/ *?\}\} *?$/, '');
  //start parsing citation into json
  let obj = {};
  let lines = str.split(/\|/g);
  //first line is 'cite web'
  let type = lines[0].match(/cite ([a-z_]+)/i) || [];
  if (type[1]) {
    obj.type = type[1] || null;
  }
  for (let i = 1; i < lines.length; i += 1) {
    let arr = lines[i].split(/=/);
    let key = arr[0].trim();
    let val = arr.slice(1, arr.length).join('=').trim();
    if (key && val) {
      //turn numbers into numbers
      if (/^[0-9.]+$/.test(val)) {
        val = parseFloat(val);
      }
      obj[key] = val;
    }
  }
  if (Object.keys(obj).length === 0) {
    return null;
  }
  return {
    template: 'citation',
    data: obj
  };
};
module.exports = parseCitation;
