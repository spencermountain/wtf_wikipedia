const keyValue = require('./key-value');
const getName = require('./_getName');
const maybeKeyValue = /\|.+?[a-z].+?=/; // |foo=

const knownTemplate = function(name) {
  if (/cite [a-z0-9]/.test(name)) {
    return 'citation';
  }
  return null;
};
//
const genericTemplate = function(tmpl, options) {
  if (maybeKeyValue.test(tmpl)) {
    let name = getName(tmpl);
    let data = keyValue(tmpl);
    if (data) {
      let obj = {
        name: name,
        data: data
      };
      let template = knownTemplate(name);
      if (options.citations === false && template === 'citation') {
        return null;
      }
      if (template) {
        obj.template = template;
      }
      return obj;
    }
  }
  return null;
};
module.exports = genericTemplate;
