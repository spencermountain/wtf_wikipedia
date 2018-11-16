const whoCares = {
  'classname': true,
  'style': true,
  'align': true,
  'margin': true,
  'left': true,
  'break': true,
  'boxsize': true,
  'collapsible': true,
  'display': true,
};

//remove wiki-cruft & some styling info from templates
const cleanup = function(obj) {
  Object.keys(obj).forEach((k) => {
    if (whoCares[k.toLowerCase()] === true) {
      delete obj[k];
    }
    //remove empty values, too
    if (obj[k] === null || obj[k] === '') {
      delete obj[k];
    }
  });
  return obj;
};
module.exports = cleanup;
