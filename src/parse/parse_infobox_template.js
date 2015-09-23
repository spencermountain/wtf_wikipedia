var i18n = require("../data/i18n");

function parse_infobox_template(str) {
  var template = '';
  if(str) {
    var infobox_template_reg = new RegExp("\{\{(?:" + i18n.infoboxes.join("|") + ")\\s*(.*)", "i");
    var matches = str.match(infobox_template_reg);
    if(matches && matches.length > 1) {
      template = matches[1];
    }
  }
  return template;
}
module.exports = parse_infobox_template;
