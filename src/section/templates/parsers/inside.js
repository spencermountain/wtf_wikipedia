
const grabInside = function(tmpl) {
  let parts = tmpl.split('|');
  if (typeof parts[1] !== 'string') {
    return null;
  }
  return {
    template: parts[0].trim().toLowerCase(),
    data: parts[1].trim()
  };
};
module.exports = grabInside;
