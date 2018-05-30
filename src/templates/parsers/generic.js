const keyValue = require('./keyValue');
const getName = require('./_getName');
const maybeKeyValue = /\|.+?[a-z].+?=/; // |foo=

const knownTemplate = function(name) {
  if (/cite [a-z0-9]/.test(name) || name.toLowerCase().trim() === 'citation') {
    return 'citation';
  }
  return null;
};

//just go for it.
const genericTemplate = function(tmpl) {
  if (maybeKeyValue.test(tmpl)) {
    let name = getName(tmpl);
    if (name === null) {
      return null;
    }
    let data = keyValue(tmpl);
    if (data) {
      let obj = {
        name: name,
        data: data
      };
      let template = knownTemplate(name);
      if (template) {
        obj.template = template;
      }
      return obj;
    }
  }
  return null;
};
module.exports = genericTemplate;
