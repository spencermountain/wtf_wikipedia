//remove the top/bottom off the template
const strip = function(tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '');
  tmpl = tmpl.replace(/\}\}$/, '');
  return tmpl;
};
module.exports = strip;
