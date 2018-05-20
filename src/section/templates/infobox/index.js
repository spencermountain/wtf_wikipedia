const i18n = require('../../../data/i18n');
const is_info = new RegExp('^(subst.)?(' + i18n.infoboxes.join('|') + ')[: \n]', 'i');
//
const isInfobox = function(tmpl) {
  return is_info.test(tmpl);
};

const templateName = function(name) {
  const reg = new RegExp('^(subst.)?(' + i18n.infoboxes.join('|') + ') +?', 'i');
  return name.replace(reg, '');
};
module.exports = {
  isInfobox: isInfobox,
  templateName: templateName,
};
