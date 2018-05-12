const keyValue = require('./key-value');
const maybeKeyValue = /\|.+?[a-z].+?=/g; // |foo=
//
const defaultTemplate = function(tmpl) {
  if (maybeKeyValue.test(tmpl)) {
    return keyValue(tmpl);
  }
  return null;
};
module.exports = defaultTemplate;
