const i18n = require('../data/i18n');
const template_reg = new RegExp('\\{\\{ ?(' + i18n.disambigs.join('|') + ')(\\|[a-z =]*?)? ?\\}\\}', 'i');

const isDisambig = function(wiki) {
  return template_reg.test(wiki);
};

module.exports = {
  isDisambig: isDisambig
};
