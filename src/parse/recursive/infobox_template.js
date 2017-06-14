const i18n = require('../../data/i18n');
const infobox_template_reg = new RegExp('{{(?:' + i18n.infoboxes.join('|') + ')\\s*(.*)', 'i');

function parse_infobox_template(str) {
  let template = '';
  if (str) {
    const matches = str.match(infobox_template_reg);
    if (matches && matches.length > 1) {
      template = matches[1];
    }
  }
  return template;
}
module.exports = parse_infobox_template;
