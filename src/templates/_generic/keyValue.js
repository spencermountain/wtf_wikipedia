const i18n = require('../../_data/i18n');
const isInfobox = new RegExp('^(subst.)?(' + i18n.infoboxes.join('|') + ')[: \n]', 'i');
const isCitation = new RegExp('^(cite |citation)', 'i');
const keyValue = require('../_parsers/keyValue');

const infoboxType = function(name) {
  const reg = new RegExp('^(subst.)?(' + i18n.infoboxes.join('|') + ') *?', 'i');
  name = name.replace(reg, '');
  return name.trim();
};

//try to parse unknown template as a {{name|key=val|key2=val2}} format
const doKeyValue = function(tmpl, name) {
  //handle infoboxes
  if (name === 'infobox' || isInfobox.test(name)) {
    return {
      template: 'infobox',
      type: infoboxType(name),
      data: keyValue(tmpl, true)
    };
  }
  let data = keyValue(tmpl);
  //handle citation templates
  if (isCitation.test(name)) {
    let type = name.replace(/^cite +/, '').trim();
    return {
      template: 'citation',
      type: type,
      data: data
    };
  }
  //generic response
  //try to bury some annoying ones
  if (Object.keys(data).length === 1 && (data.date || data.state || data.format)) {
    return null;
  }
  return {
    template: name,
    data: data
  };
};
module.exports = doKeyValue;
