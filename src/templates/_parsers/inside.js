const strip = require('./_strip');

const grabInside = function(tmpl) {
  tmpl = strip(tmpl);
  let parts = tmpl.split('|');
  if (typeof parts[1] !== 'string') {
    return null;
  }
  //only split on the first pipe:
  parts[1] = parts.slice(1).join('|');

  let value = parts[1].trim();
  value = value.replace(/^[a-z0-9]{1,7}=/, ''); //support 'foo=value'
  return {
    template: parts[0].trim().toLowerCase(),
    data: value
  };
};
module.exports = grabInside;
